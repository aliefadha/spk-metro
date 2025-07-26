import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const FinalTabel = () => {
  const [kpiList, setKpiList] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]); // eslint-disable-line no-unused-vars
  const [siRiData, setSiRiData] = useState([]); // eslint-disable-line no-unused-vars
  const [vikorResult, setVikorResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportData, setReportData] = useState([]);

  // Fetch Developer KPI Metrics only
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        // First, get Developer division ID
        const divisionsResponse = await api.get("http://localhost:3000/api/v1/division");
        const divisions = divisionsResponse.data.data;
        const developerDivision = divisions.find(d => d.divisionName === "Developer");
        
        if (developerDivision) {
          const url = `http://localhost:3000/api/v1/metrics/division?divisionId=${developerDivision.id}`;
          const response = await api.get(url);
          setKpiList(response.data.data);
        } else {
          setKpiList([]);
        }
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
        setKpiList([]);
      }
    };

    fetchKPI();
  }, []);

  // Fetch Developer data only
  const fetchKPIReport = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all projects for Developer division
      const projectsResponse = await api.get("http://localhost:3000/api/v1/projects");
      const projects = projectsResponse.data.data || [];
      
      // Get current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-11
      const currentYear = currentDate.getFullYear();
      
      // Filter only DONE projects with tanggal_selesai in current month
      const doneProjects = projects.filter(p => {
        if (p.status !== "DONE" || !p.tanggal_selesai) return false;
        
        try {
          const completionDate = new Date(p.tanggal_selesai);
          return completionDate.getMonth() === currentMonth && 
                 completionDate.getFullYear() === currentYear;
        } catch (error) {
          console.error("Error parsing tanggal_selesai:", p.tanggal_selesai, error);
          return false;
        }
      });
      
      // Get assessments for all done projects
      const allAssessments = [];
      for (const project of doneProjects) {
        try {
          const assessmentResponse = await api.get(`http://localhost:3000/api/v1/assessments/project/${project.id}`);
          const projectAssessments = assessmentResponse.data.data || [];
          
          // Add project info to each assessment
          projectAssessments.forEach(assessment => {
            assessment.projectName = project.projectName;
            assessment.projectId = project.id;
            assessment.projectBobot = project.bobot; // Add project weight
          });
          
          allAssessments.push(...projectAssessments);
        } catch (error) {
          console.error(`Failed to fetch assessments for project ${project.id}:`, error);
        }
      }
      
      // Group assessments by user and calculate weighted scores
      const userAssessments = {};
      allAssessments.forEach(assessment => {
        if (!userAssessments[assessment.userId]) {
          userAssessments[assessment.userId] = {
            userId: assessment.userId,
            fullName: assessment.fullName,
            assesmentDate: assessment.assesmentDate,
            metrics: {}
          };
        }
        
        // Store raw metric values without calculation
        assessment.metrics.forEach(metric => {
          if (!userAssessments[assessment.userId].metrics[metric.metricId]) {
            userAssessments[assessment.userId].metrics[metric.metricId] = {
              totalWeightedScore: 0,
              totalWeight: 0
            };
          }
          
          // Use raw metric value directly
          userAssessments[assessment.userId].metrics[metric.metricId].totalWeightedScore += metric.value;
          userAssessments[assessment.userId].metrics[metric.metricId].totalWeight += 1;
        });
      });
      
      // Convert to expected format
      const developerData = Object.values(userAssessments).map(user => ({
        userId: user.userId,
        fullName: user.fullName,
        assesmentDate: user.assesmentDate,
        metrics: kpiList.map(kpi => {
          const metricData = user.metrics[kpi.id];
          if (metricData && metricData.totalWeightedScore) {
            // Use raw totalWeightedScore without any calculation
            return {
              metricId: kpi.id,
              value: metricData.totalWeightedScore
            };
          }
          return {
            metricId: kpi.id,
            value: 0
          };
        })
      }));
      
      // Format the data to match the expected structure and align with division-specific KPIs
      const formattedData = developerData.map((user) => {
        // Create metrics array aligned with the current kpiList order
        const metrics = kpiList.map(kpi => {
          const userMetric = user.metrics.find(m => m.metricId === kpi.id);
          return userMetric ? userMetric.value : 0;
        });
        
        return {
          fullName: user.fullName,
          metrics: metrics
        };
      });
      
      setReportData(formattedData);
      
      // Calculate normalized matrix from matriks keputusan data
      const normalizedMatrix = formattedData.map(user => {
        const normalizedValues = user.metrics.map((value, metricIndex) => {
          const kpi = kpiList[metricIndex];
          
          // Get all values for this metric across all users
          const allValuesForMetric = formattedData.map(u => u.metrics[metricIndex]);
          const minValue = Math.min(...allValuesForMetric);
          const maxValue = Math.max(...allValuesForMetric);
          
          // Avoid division by zero
          if (maxValue === minValue) {
            return 1; // If all values are the same, normalize to 1
          }
          
          let normalizedValue;
          if (kpi.char === 'Benefit') {
            // For benefit criteria: higher is better
            normalizedValue = (maxValue - value) / (maxValue - minValue);
          } else if (kpi.char === 'Cost') {
            // For cost criteria: lower is better
            normalizedValue = (value - minValue) / (maxValue - minValue);
          } else {
            // Default to benefit if char is not specified
            normalizedValue = (value - minValue) / (maxValue - minValue);
          }
          
          return Math.round(normalizedValue * 1000) / 1000; // Round to 3 decimal places
        });
        
        return {
          fullName: user.fullName,
          values: normalizedValues
        };
      });
      
      setNormalizedData(normalizedMatrix);

      // Calculate and log sum of all weights
      const totalWeight = kpiList.reduce((sum, kpi) => sum + parseFloat(kpi.bobot), 0);
      
      const calculatedSiRi = normalizedMatrix.map(user => {
        
        // Si = Σ(wj/totalWeight * rij) - weighted sum using normalized values
        const si = user.values.reduce((sum, value, index) => {
          const weight = parseFloat(kpiList[index].bobot);
          const normalizedWeight = weight / totalWeight;
          const weightedValue = normalizedWeight * value;
          return sum + weightedValue;
        }, 0);
        
        
        // Ri = max(wj/totalWeight * rij) - weighted maximum using normalized values
        const ri = Math.max(...user.values.map((value, index) => {
          const weight = parseFloat(kpiList[index].bobot);
          const normalizedWeight = weight / totalWeight;
          const weightedValue = normalizedWeight * value;
          return weightedValue;
        }));
        
        return {
          fullName: user.fullName,
          Si: Math.round(si * 1000) / 1000, // Round to 3 decimal places
          Ri: Math.round(ri * 1000) / 1000
        };
      });
      
      setSiRiData(calculatedSiRi);
      
      // Calculate Qi values using VIKOR method
      const calculatedQi = calculatedSiRi.map(user => {
        // Calculate Si* (minimum Si) and Ri* (minimum Ri) from all users
        const allSiValues = calculatedSiRi.map(u => u.Si);
        const allRiValues = calculatedSiRi.map(u => u.Ri);
        const siMin = Math.min(...allSiValues);
        const siMax = Math.max(...allSiValues);
        const riMin = Math.min(...allRiValues);
        const riMax = Math.max(...allRiValues);
        
        // Calculate Qi using VIKOR formula: Qi = v * (Si - Si*)/(Si- - Si*) + (1-v) * (Ri - Ri*)/(Ri- - Ri*)
        // where v = 0.5 (typical weight for group utility)
        const v = 0.5;
        let qi = 0;
        
        if (siMax !== siMin && riMax !== riMin) {
          const siComponent = v * (user.Si - siMin) / (siMax - siMin);
          const riComponent = (1 - v) * (user.Ri - riMin) / (riMax - riMin);
          qi = siComponent + riComponent;
        }
        
        return {
          fullName: user.fullName,
          Qi: Math.round(qi * 1000) / 1000 // Round to 3 decimal places
        };
      });
      
      // Sort Qi values from lowest to highest (best to worst in VIKOR)
      const sortedQi = calculatedQi.sort((a, b) => a.Qi - b.Qi);
      
      // Add ranking to sorted results
      const rankedQi = sortedQi.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      setVikorResult(rankedQi);
    } catch (error) {
      console.error("Gagal mengambil data KPI Report:", error);
      setError("Gagal mengambil data");
      setReportData([]);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data KPI Report.",
      });
    } finally {
      setLoading(false);
    }
  }, [kpiList]);

  useEffect(() => {
    // Only fetch report data if we have KPIs loaded
    if (kpiList.length > 0) {
      fetchKPIReport();
    }
  }, [kpiList, fetchKPIReport]);



  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : kpiList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada KPI untuk divisi Developer</p>
            <p className="text-sm">Silakan tambahkan KPI untuk divisi ini terlebih dahulu</p>
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada data assessment untuk divisi Developer</p>
          </div>
        ) : (
          <div>
            <table className="w-full" style={{ fontSize: "12px" }}>
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                  <th className="px-4 py-3 text-left text-primer">Qi</th>
                  <th className="px-4 py-3 text-left text-primer">Rank</th>
                </tr>
              </thead>
              <tbody>
                {vikorResult.length > 0 ? (
                  vikorResult.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{row.fullName}</td>
                      <td className="px-4 py-3 text-left">{row.Qi}</td>
                      <td className="px-4 py-3 text-left">{row.rank}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {vikorResult.length > 0 && (
              <div className="mt-6">
                <div
                  className="bg-primer text-white p-4 rounded-lg"
                  style={{
                    backgroundColor: "#7E0EFF",
                    borderRadius: "10px",
                  }}
                >
                  <h2 className="text-lg font-semibold">
                    Selamat, {vikorResult[0]?.fullName} mendapat promosi dan kesempatan untuk menjadi PM di Next Project!
                  </h2>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalTabel;
