import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";
import { getUser } from "@/utils/auth";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FileText } from "lucide-react";

const KPIReportTableIndividual = ({ selectedDivision, selectedMonth }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiList, setKpiList] = useState([]);

  // Fetch KPI Metrics based on logged user's division or selected division
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) {
          console.error("No user found");
          return;
        }


        
        // If SUPERADMIN and no division selected, don't fetch KPIs
        if (currentUser.role === 'SUPERADMIN' && !selectedDivision) {

          setKpiList([]);
          return;
        } else if (selectedDivision) {
          // If division is selected, fetch KPIs for that specific division

          const divisionsResponse = await api.get("http://localhost:3000/api/v1/division");
          const divisions = divisionsResponse.data.data;
          const targetDivision = divisions.find(d => d.divisionName === selectedDivision);
          
          if (targetDivision) {
            const response = await api.get(
              `http://localhost:3000/api/v1/metrics/division?divisionId=${targetDivision.id}`
            );

            setKpiList(response.data.data);
          } else {
            setKpiList([]);
          }
        } else if (currentUser.divisionId) {
          // Regular users see KPIs for their division

          const response = await api.get(`http://localhost:3000/api/v1/metrics/division?divisionId=${currentUser.divisionId}`);

          setKpiList(response.data.data);
        } else {
          // If no divisionId, fetch all KPIs (fallback)

          const response = await api.get("http://localhost:3000/api/v1/metrics");

          setKpiList(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
        setKpiList([]);
      }
    };

    fetchKPI();
  }, [selectedDivision]);

  // Fetch logged user's individual KPI Report
  const fetchKPIReport = useCallback(async (month = "") => {
    try {
      setLoading(true);
      const currentUser = getUser();
      
      if (!currentUser) {
        console.error("No user found");
        return;
      }

      // If no division is selected and user is SUPERADMIN, don't show any data
      if (currentUser?.role === 'SUPERADMIN' && !selectedDivision) {

        setReportData([]);
        return;
      }

      // Get division information - either selected division or user's division
      let targetDivision = null;
      try {
        const divisionsResponse = await api.get("http://localhost:3000/api/v1/division");
        const divisions = divisionsResponse.data.data;
        
        if (selectedDivision) {
          // Use selected division if provided
          targetDivision = divisions.find(d => d.divisionName === selectedDivision);
        } else if (currentUser.divisionId) {
          // Use user's division as fallback
          targetDivision = divisions.find(d => d.id === currentUser.divisionId);
        }
      } catch (error) {
        console.error("Error fetching division info:", error);
      }

      let response;
      
      if (targetDivision && targetDivision.divisionName === "Developer") {
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
          
          // Filter assessments based on user role
          let filteredAssessments;
          if (currentUser.role === 'SUPERADMIN') {
            // SUPERADMIN sees all assessments
            filteredAssessments = allAssessments;
          } else {
            // Regular users see only their own assessments
            filteredAssessments = allAssessments.filter(assessment => 
              assessment.userId === currentUser.id
            );
          }
          
          // Group assessments by user for processing
          const userAssessmentsMap = {};
          filteredAssessments.forEach(assessment => {
            if (!userAssessmentsMap[assessment.userId]) {
              userAssessmentsMap[assessment.userId] = {
                userId: assessment.userId,
                fullName: assessment.fullName,
                assesmentDate: null,
                metrics: {}
              };
            }
            
            const userAssessments = userAssessmentsMap[assessment.userId];
            if (!userAssessments.assesmentDate) {
              userAssessments.assesmentDate = assessment.assesmentDate;
            }
            
            // Calculate weighted scores for each metric
            assessment.metrics.forEach(metric => {
              if (!userAssessments.metrics[metric.metricId]) {
                userAssessments.metrics[metric.metricId] = {
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
                userAssessments.metrics[metric.metricId].totalWeightedScore += weightedScore;
                userAssessments.metrics[metric.metricId].totalWeight += assessment.projectBobot;
              }
            });
          });
          
          // Convert to expected format with weighted averages for all users
          let developerData = [];
          if (filteredAssessments.length > 0) {
            developerData = Object.values(userAssessmentsMap).map(userAssessments => ({
              userId: userAssessments.userId,
              fullName: userAssessments.fullName,
              assesmentDate: userAssessments.assesmentDate,
              metrics: kpiList.map(kpi => {
                const metricData = userAssessments.metrics[kpi.id];
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
          }
          
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
        } else if (targetDivision) {
          // For non-developer divisions, get assessments based on user role and selected division
          let url;
          if (currentUser.role === 'SUPERADMIN' && !selectedDivision) {
            // SUPERADMIN with no division selected sees all assessments
            url = `http://localhost:3000/api/v1/assessments-nondev`;
          } else {
            // Use target division (either selected or user's division)
            url = `http://localhost:3000/api/v1/assessments-nondev/division/${targetDivision.divisionName}`;
          }
          
          // Add month parameter if provided
          if (month) {
            url += url.includes('?') ? `&month=${month}` : `?month=${month}`;
          }
          
          const allAssessmentsResponse = await api.get(url);
          const allAssessments = allAssessmentsResponse.data.data || [];
          
          // Filter assessments based on user role
          let filteredAssessments;
          if (currentUser.role === 'SUPERADMIN') {
            // SUPERADMIN sees all assessments
            filteredAssessments = allAssessments;
          } else {
            // Regular users see only their own assessments
            filteredAssessments = allAssessments.filter(assessment => 
              assessment.userId === currentUser.id
            );
          }

          
          // Convert the backend response format to match expected structure

          const convertedData = filteredAssessments.map(user => {

            // Convert metrics object to metrics array format
            const metricsArray = kpiList.map(kpi => {
              // Find metric value by KPI name in the metrics object
              const metricValue = user.metrics && user.metrics[kpi.kpiName] ? user.metrics[kpi.kpiName] : 0;

              return {
                metricId: kpi.id,
                value: metricValue
              };
            });
            
            return {
              userId: user.userId,
              fullName: user.fullName,
              metrics: metricsArray,
              assesmentDate: user.assesmentDate || user.created_at
            };
          });

          
          response = { data: { data: convertedData } };
        } else {
          // No division information available
          response = { data: { data: [] } };
        }
        
        // Format the data to match the expected structure and align with division-specific KPIs
        const formattedData = response.data.data.map((user) => {
          // Create metrics array aligned with the current kpiList order
          const metrics = kpiList.map(kpi => {
            const userMetric = user.metrics.find(m => m.metricId === kpi.id);
            const value = userMetric ? userMetric.value : 0;

            return value;
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
      fetchKPIReport(selectedMonth);
    }
  }, [selectedMonth, selectedDivision, kpiList, fetchKPIReport]);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mr-3">
             {(() => {
               const currentUser = getUser();
               if (selectedDivision) {
                 return `Laporan KPI Divisi ${selectedDivision}`;
               } else if (currentUser?.role === 'SUPERADMIN') {
                 return 'Laporan KPI - Pilih Divisi';
               } else {
                 return 'Laporan KPI Individual Saya';
               }
             })()} 
             {selectedMonth && (
               <span className="text-sm font-normal text-gray-600 ml-2">
                 - {new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
               </span>
             )}
           </h2>
           {(() => {
             const currentUser = getUser();
             if (currentUser?.role === 'SUPERADMIN' && !selectedDivision) {
               return (
                 <p className="text-sm text-gray-500 mt-1">
                   Silakan pilih divisi untuk melihat laporan KPI
                 </p>
               );
             }
             return null;
           })()}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (() => {
          const currentUser = getUser();
          if (currentUser?.role === 'SUPERADMIN' && !selectedDivision) {
            return (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500">Pilih divisi terlebih dahulu untuk melihat laporan KPI</p>
                </div>
              </div>
            );
          }
          
          return (
            <table className="w-full" style={{ fontSize: "12px" }}>
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                  {kpiList.map((kpi) => (
                    <th key={kpi.id} className="px-4 py-3 text-center text-primer">
                      {kpi.kpiName}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-primer">
                    Average Skor
                  </th>
                </tr>
              </thead>
              <tbody>
                {kpiList.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p>Tidak ada KPI untuk divisi Anda</p>
                        <p className="text-sm">Silakan hubungi admin untuk menambahkan KPI</p>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={kpiList.length + 2} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p>Tidak ada data assessment untuk Anda</p>
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
          );
        })()}
      </div>

    </div>
  );
};

KPIReportTableIndividual.propTypes = {
  selectedDivision: PropTypes.string,
  selectedMonth: PropTypes.string,
};

export default KPIReportTableIndividual;
