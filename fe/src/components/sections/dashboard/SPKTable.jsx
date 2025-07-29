import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const SPKTable = () => {
  const [kpiList, setKpiList] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [siRiData, setSiRiData] = useState([]);
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
      
      // Get current month and year for API query
      const currentDate = new Date();
      const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 1-12, zero-padded
      const currentYear = currentDate.getFullYear();
      const monthParam = `${currentYear}-${currentMonth}`;
      
      // Get DONE projects for current month using backend filtering
      const projectsResponse = await api.get(`http://localhost:3000/api/v1/projects/done?month=${monthParam}`);
      const doneProjects = projectsResponse.data.data || [];
      
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
      
      // Group assessments by user and calculate weighted scores using skorAkhir
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
        
        // Calculate weighted scores for each metric using skorAkhir formula
        assessment.metrics.forEach(metric => {
          if (!userAssessments[assessment.userId].metrics[metric.metricId]) {
            userAssessments[assessment.userId].metrics[metric.metricId] = {
              totalWeightedScore: 0,
              totalWeight: 0
            };
          }
          
          // Find the KPI to get target for skorAkhir calculation
          const kpi = kpiList.find(k => k.id === metric.metricId);
          
          if (kpi && kpi.target && metric.value !== 0) {
            const actual = metric.value;
            const target = kpi.target;
            // Calculate skorAkhir: (actual / target) * 100
            const skorAkhir = Math.round(((actual / target) * 100) * 1000) / 1000;
            
            // Add weighted score: skorAkhir * project.bobot
            const weightedScore = Math.round((skorAkhir * assessment.projectBobot) * 1000) / 1000;
            
            userAssessments[assessment.userId].metrics[metric.metricId].totalWeightedScore += weightedScore;
            userAssessments[assessment.userId].metrics[metric.metricId].totalWeight += assessment.projectBobot;
          }
        });
      });
      
      // Convert to expected format with weighted averages
      const developerData = Object.values(userAssessments).map(user => ({
        userId: user.userId,
        fullName: user.fullName,
        assesmentDate: user.assesmentDate,
        metrics: kpiList.map(kpi => {
          const metricData = user.metrics[kpi.id];
          if (metricData && metricData.totalWeight > 0) {
            // Calculate weighted average: sum(skorAkhir * bobot) / sum(bobot)
            const weightedAverage = metricData.totalWeightedScore / metricData.totalWeight;
            const roundedValue = Math.round(weightedAverage * 1000) / 1000;
            
            return {
              metricId: kpi.id,
              value: roundedValue
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
      
      /*
       * VIKOR CALCULATION WITH SKORAKHIR VALUES:
       * 
       * 1. Decision Matrix now uses skorAkhir values:
       *    - skorAkhir = (actual / target) * 100 for each metric
       *    - Weighted averages across projects using project.bobot
       *    - Consistent with KPIReportTableIndividual.jsx logic
       * 
       * 2. Normalization formulas:
       *    - Benefit criteria: (value - min) / (max - min) [higher values = better]
       *    - Cost criteria: (max - value) / (max - min) [lower values = better]
       * 
       * 3. VIKOR Method Steps:
       *    - Step 1: Normalize decision matrix (using skorAkhir values)
       *    - Step 2: Calculate Si (weighted sum) and Ri (weighted maximum)
       *    - Step 3: Calculate Qi using v=0.5 compromise weight
       *    - Step 4: Rank alternatives by Qi (lowest = best)
       */
      
      // Calculate normalized matrix from matriks keputusan data (now using skorAkhir values)
      
      const normalizedMatrix = formattedData.map((user) => {
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
          
          const roundedValue = Math.round(normalizedValue * 1000) / 1000;
          return roundedValue; // Round to 3 decimal places
        });
        
        return {
          fullName: user.fullName,
          values: normalizedValues
        };
      });
      
      setNormalizedData(normalizedMatrix);

      // Calculate sum of all weights
      const totalWeight = Math.round(kpiList.reduce((sum, kpi) => sum + parseFloat(kpi.bobot), 0) * 1000) / 1000;
      
      const calculatedSiRi = normalizedMatrix.map(user => {
        // Si = Σ(wj/totalWeight * rij) - weighted sum using normalized values
        const si = user.values.reduce((sum, value, index) => {
          const weight = parseFloat(kpiList[index].bobot);
          const normalizedWeight = Math.round((weight / totalWeight) * 1000) / 1000;
          const weightedValue = Math.round((normalizedWeight * value) * 1000) / 1000;
          return sum + weightedValue;
        }, 0);
        
        const roundedSi = Math.round(si * 1000) / 1000;
        
        // Ri = max(wj/totalWeight * rij) - weighted maximum using normalized values
        const weightedValues = user.values.map((value, index) => {
          const weight = parseFloat(kpiList[index].bobot);
          const normalizedWeight = Math.round((weight / totalWeight) * 1000) / 1000;
          const weightedValue = Math.round((normalizedWeight * value) * 1000) / 1000;
          return weightedValue;
        });
        const ri = Math.max(...weightedValues);
        const roundedRi = Math.round(ri * 1000) / 1000;
        
        return {
          fullName: user.fullName,
          Si: roundedSi,
          Ri: roundedRi
        };
      });
      
      setSiRiData(calculatedSiRi);
      
      // Calculate Qi values using VIKOR method
      const allSiValues = calculatedSiRi.map(u => u.Si);
      const allRiValues = calculatedSiRi.map(u => u.Ri);
      const siMin = Math.min(...allSiValues);
      const siMax = Math.max(...allSiValues);
      const riMin = Math.min(...allRiValues);
      const riMax = Math.max(...allRiValues);
      
      const calculatedQi = calculatedSiRi.map(user => {
        // Calculate Qi using VIKOR formula: Qi = v * (Si - Si*)/(Si- - Si*) + (1-v) * (Ri - Ri*)/(Ri- - Ri*)
        // where v = 0.5 (typical weight for group utility)
        const v = 0.5;
        let qi = 0;
        
        if (siMax !== siMin && riMax !== riMin) {
          const siComponent = Math.round((v * (user.Si - siMin) / (siMax - siMin)) * 1000) / 1000;
          const riComponent = Math.round(((1 - v) * (user.Ri - riMin) / (riMax - riMin)) * 1000) / 1000;
          qi = siComponent + riComponent;
        }
        
        const roundedQi = Math.round(qi * 1000) / 1000;
        
        return {
          fullName: user.fullName,
          Qi: roundedQi
        };
      });
      
      // Sort Qi values from lowest to highest (best to worst in VIKOR)
      const sortedQi = calculatedQi.sort((a, b) => a.Qi - b.Qi);
      
      setVikorResult(sortedQi);
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

  const renderMetricTable = (data) => (
    <table className="w-full" style={{ fontSize: "12px" }}>
      <thead>
        <tr className="bg-purple-50">
          <th className="px-4 py-3 text-left text-primer">Nama Member</th>
          {kpiList.map((kpi) => (
            <th key={kpi.id} className="px-4 py-3 text-left text-primer">
              {kpi.kpiName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3">{row.fullName}</td>
              {row.values.map((value, idx) => (
                <td
                  key={idx}
                  className="px-4 py-3"
                  style={{ textAlign: "center" }}
                >
                  {typeof value === 'number' ? value.toFixed(3) : value}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              Tidak ada data.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      {/* Matriks Keputusan */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <h2 className="text-xl font-semibold mr-3">
          1. Matriks Keputusan
          <span className="text-sm font-normal text-gray-600 ml-2">
          </span>
        </h2>
      </div>

      {/* Table */}
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
          <table className="w-full" style={{ fontSize: "12px" }}>
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                {kpiList.map((kpi) => (
                  <th key={kpi.id} className="px-4 py-3 text-center text-primer">
                    {kpi.kpiName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-medium">
                    {row.fullName}
                  </td>
                  {row.metrics.map((value, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-3"
                      style={{ textAlign: "center" }}
                    >
                      {typeof value === 'number' ? value.toFixed(3) : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 2. Normalisasi Matriks */}
      {reportData.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-6 mt-10">
            <h2 className="text-xl font-semibold mr-3">2. Normalisasi Matriks</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center">Memuat data...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              renderMetricTable(normalizedData)
            )}
          </div>
        </>
      )}

      {/* 3. Menghitung nilai Si dan Ri */}
      {reportData.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-6 mt-10">
            <h2 className="text-xl font-semibold mr-3">
              3. Menghitung nilai Si dan Ri
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "12px" }}>
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                  <th className="px-4 py-3 text-left text-primer">Si</th>
                  <th className="px-4 py-3 text-left text-primer">Ri</th>
                </tr>
              </thead>
              <tbody>
                {siRiData.length > 0 ? (
                  siRiData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{row.fullName}</td>
                      <td className="px-4 py-3 text-left">{typeof row.Si === 'number' ? row.Si.toFixed(3) : row.Si}</td>
                      <td className="px-4 py-3 text-left">{typeof row.Ri === 'number' ? row.Ri.toFixed(3) : row.Ri}</td>
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
          </div>
        </>
      )}

      {/* 4. Menghitung Nilai Qi */}
      {reportData.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-6 mt-10">
            <h2 className="text-xl font-semibold mr-3">4. Menghitung Nilai Qi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "12px" }}>
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                  <th className="px-4 py-3 text-left text-primer">Qi</th>
                </tr>
              </thead>
              <tbody>
                {vikorResult.length > 0 ? (
                  vikorResult.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{row.fullName}</td>
                      <td className="px-4 py-3 text-left">{typeof row.Qi === 'number' ? row.Qi.toFixed(3) : row.Qi}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SPKTable;
