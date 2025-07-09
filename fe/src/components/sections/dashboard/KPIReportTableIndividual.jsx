import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FileText } from "lucide-react";

const KPIReportTableIndividual = ({ selectedDivision, selectedMonth }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiList, setKpiList] = useState([]);

  // Fetch KPI Metrics based on selected division
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        let url = "http://localhost:3000/api/v1/metrics";
        
        // If a division is selected, fetch KPIs specific to that division
        if (selectedDivision) {
          // First, get division ID from division name
          const divisionsResponse = await api.get("http://localhost:3000/api/v1/division");
          const divisions = divisionsResponse.data.data;
          const selectedDivisionData = divisions.find(d => d.divisionName === selectedDivision);
          
          if (selectedDivisionData) {
            url = `http://localhost:3000/api/v1/metrics/division?divisionId=${selectedDivisionData.id}`;
          }
        }
        
        const response = await api.get(url);
        setKpiList(response.data.data);
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
        setKpiList([]);
      }
    };

    fetchKPI();
  }, [selectedDivision]);

  // Fetch data KPI Report dari API untuk non-developer divisions
  const fetchKPIReport = useCallback(async (divisionName = "", month = "") => {
    try {
      setLoading(true);
      let response;
      
      if (divisionName) {
        if (divisionName === "Developer") {
          // For Developer division, we need to get all projects and their assessments
          let projectsUrl = "http://localhost:3000/api/v1/projects";
          
          // Add month parameter if provided for done projects
          if (month) {
            projectsUrl = `http://localhost:3000/api/v1/projects/done?month=${month}`;
          }
          
          const projectsResponse = await api.get(projectsUrl);
          const projects = projectsResponse.data.data || [];
          
          // Filter only DONE projects if no month filter is applied
          const doneProjects = month ? projects : projects.filter(p => p.status === "DONE");
          
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
            
            // Calculate weighted scores for each metric
            assessment.metrics.forEach(metric => {
              if (!userAssessments[assessment.userId].metrics[metric.metricId]) {
                userAssessments[assessment.userId].metrics[metric.metricId] = {
                  totalWeightedScore: 0,
                  totalWeight: 0
                };
              }
              
              // Find the KPI to get target and char for skorAkhir calculation
              const kpi = kpiList.find(k => k.id === metric.metricId);
              if (kpi && kpi.target && metric.value !== 0) {
                const actual = metric.value;
                const target = kpi.target;
                let skorAkhir = 0;
                
                // Calculate skorAkhir based on characteristic
                if (kpi.char === 'Benefit') {
                  skorAkhir = (actual / target) * 100;
                } else if (kpi.char === 'Cost') {
                  skorAkhir = (target / actual) * 100;
                }
                
                // Add weighted score: skorAkhir * project.bobot
                const weightedScore = skorAkhir * assessment.projectBobot;
                userAssessments[assessment.userId].metrics[metric.metricId].totalWeightedScore += weightedScore;
                userAssessments[assessment.userId].metrics[metric.metricId].totalWeight += assessment.projectBobot;
              }
            });
          });
          
          // Convert to expected format with weighted averages
          let developerData = Object.values(userAssessments).map(user => ({
            userId: user.userId,
            fullName: user.fullName,
            assesmentDate: user.assesmentDate,
            metrics: kpiList.map(kpi => {
              const metricData = user.metrics[kpi.id];
              if (metricData && metricData.totalWeight > 0) {
                // Calculate weighted average: sum(skorAkhir * bobot) / sum(bobot)
                const weightedAverage = metricData.totalWeightedScore / metricData.totalWeight;
                return {
                  metricId: kpi.id,
                  value: Math.round(weightedAverage * 100) / 100 // Round to 2 decimal places
                };
              }
              return {
                metricId: kpi.id,
                value: 0
              };
            })
          }));
          
          // Apply client-side month filtering for developer assessments if month is provided
          if (month) {
            developerData = developerData.filter((user) => {
              if (!user.assesmentDate) return false;
              
              try {
                const itemDate = new Date(user.assesmentDate);
                const selectedDate = new Date(month + '-01');
                
                return itemDate.getFullYear() === selectedDate.getFullYear() &&
                       itemDate.getMonth() === selectedDate.getMonth();
              } catch (error) {
                console.error("Error parsing date:", user.assesmentDate, error);
                return false;
              }
            });
          }
          
          response = { data: { data: developerData } };
        } else {
          // Use the non-dev assessment endpoint for non-developer divisions
          let url = `http://localhost:3000/api/v1/assessments-nondev/division/${divisionName}`;
          
          // Add month parameter if provided
          if (month) {
            url += `?month=${month}`;
          }
          
          response = await api.get(url);
        }
        
        // Format the data to match the expected structure and align with division-specific KPIs
        const formattedData = response.data.data.map((user) => {
          // Create metrics array aligned with the current kpiList order
          const metrics = kpiList.map(kpi => {
            const userMetric = user.metrics.find(m => m.metricId === kpi.id);
            return userMetric ? userMetric.value : 0;
          });
          
          const totalSkor = metrics.length > 0 
            ? (metrics.reduce((sum, val) => sum + val, 0) / metrics.length).toFixed(1)
            : 0;
          
          return {
            fullName: user.fullName,
            metrics: metrics,
            totalSkor: totalSkor
          };
        });
        
        setReportData(formattedData);
      } else {
        // Show empty data when no division is selected
        setReportData([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data KPI Report:", error);
      setError("Gagal mengambil data");
      setReportData([]);
      if (divisionName) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat mengambil data KPI Report.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [kpiList]);

  useEffect(() => {
    // Only fetch report data if we have KPIs loaded
    if (kpiList.length > 0 || !selectedDivision) {
      fetchKPIReport(selectedDivision, selectedMonth);
    }
  }, [selectedDivision, selectedMonth, kpiList, fetchKPIReport]);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <h2 className="text-xl font-semibold mr-3">
          {selectedDivision ? `Laporan KPI Individual - ${selectedDivision}` : "Laporan KPI Individual"}
          {selectedMonth && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              - {new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
            </span>
          )}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full" style={{ fontSize: "12px" }}>
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                {kpiList.map((kpi) => (
                  <th key={kpi.id} className="px-4 py-3 text-left text-primer">
                    {kpi.kpiName}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-primer">
                  Average Skor
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedDivision ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p>Silakan pilih divisi terlebih dahulu</p>
                    </div>
                  </td>
                </tr>
              ) : kpiList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p>Tidak ada KPI untuk divisi {selectedDivision}</p>
                      <p className="text-sm">Silakan tambahkan KPI untuk divisi ini terlebih dahulu</p>
                    </div>
                  </td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={kpiList.length + 2} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p>Tidak ada data assessment untuk divisi {selectedDivision}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reportData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{row.fullName}</td>
                    {row.metrics.map((value, idx) => (
                      <td
                        key={idx}
                        className="px-4 py-3"
                        style={{ textAlign: "center" }}
                      >
                        {value}
                      </td>
                    ))}
                    <td className="text-center px-4 py-3">{row.totalSkor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

KPIReportTableIndividual.propTypes = {
  selectedDivision: PropTypes.string,
  selectedMonth: PropTypes.string,
};

export default KPIReportTableIndividual;
