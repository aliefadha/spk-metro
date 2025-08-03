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
          let projectsUrl;
          
          if (month) {
            // Use specific month filtering
            projectsUrl = `http://localhost:3000/api/v1/projects/done?month=${month}`;
          } else {
            // Get current month's DONE projects when no month is specified
            const currentDate = new Date();
            const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            const currentMonthParam = `${currentYear}-${currentMonth}`;
            projectsUrl = `http://localhost:3000/api/v1/projects/done?month=${currentMonthParam}`;
          }
          
          const projectsResponse = await api.get(projectsUrl);
          const doneProjects = projectsResponse.data.data || [];
          
          // Get assessments for all done projects
          const allAssessments = [];
          for (const project of doneProjects) {
            try {
              // Add month parameter to assessment API call if provided
              let assessmentUrl = `http://localhost:3000/api/v1/assessments/project/${project.id}`;
              if (month) {
                assessmentUrl += `?month=${month}`;
              }
              
              const assessmentResponse = await api.get(assessmentUrl);
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
          filteredAssessments.forEach((assessment) => {
            if (!userAssessmentsMap[assessment.userId]) {
              userAssessmentsMap[assessment.userId] = {
                userId: assessment.userId,
                fullName: assessment.fullName,
                assesmentDate: assessment.assesmentDate,
                metrics: {}
              };
            }
            
            const userAssessments = userAssessmentsMap[assessment.userId];
            if (!userAssessments.assesmentDate) {
              userAssessments.assesmentDate = assessment.assesmentDate;
            }
            
            // Calculate weighted scores for each metric
            assessment.metrics.forEach((metric) => {
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
                
                  skorAkhir = (actual / target) * 100;
                
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
            developerData = Object.values(userAssessmentsMap).map((userAssessments) => {
              const userMetrics = kpiList.map((kpi) => {
                const metricData = userAssessments.metrics[kpi.id];
                
                if (metricData && metricData.totalWeight > 0) {
                  // Calculate weighted average: sum(skorAkhir * bobot) / sum(bobot)
                  const weightedAverage = metricData.totalWeightedScore / metricData.totalWeight;
                  const roundedValue = Math.round(weightedAverage * 100) / 100;
                  
                  return {
                    metricId: kpi.id,
                    value: roundedValue
                  };
                }
                
                return {
                  metricId: kpi.id,
                  value: 0
                };
              });
              
              return {
                userId: userAssessments.userId,
                fullName: userAssessments.fullName,
                assesmentDate: userAssessments.assesmentDate,
                metrics: userMetrics
              };
            });
          }
          
          // Month filtering is now handled by the API, no need for client-side filtering
          
          response = { data: { data: developerData } };
        } else if (targetDivision) {
          // For non-developer divisions, get assessments based on user role and selected division
          console.log('🔍 Fetching non-dev assessments for division:', targetDivision.divisionName);
          
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
          
          console.log('📡 API URL:', url);
          
          const allAssessmentsResponse = await api.get(url);
          const allAssessments = allAssessmentsResponse.data.data || [];
          
          console.log('📊 Raw backend response:', allAssessments.length, 'records');
          console.log('📊 Sample data:', allAssessments[0]);
          
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

          console.log('🔍 User role:', currentUser.role);
          console.log('👤 Current user ID:', currentUser.id);
          console.log('🎯 Filtered assessments:', filteredAssessments.length, 'records');
          console.log('🎯 Sample filtered data:', filteredAssessments[0]);
          console.log('📈 Available KPIs:', kpiList.length, 'items');
          
          // Convert the backend response format to match expected structure
          const convertedData = filteredAssessments.map(user => {
            // Backend returns metrics as array with format: {metricId, value}
            // We need to maintain this format
            const metricsArray = kpiList.map(kpi => {
              // Find metric by metricId in the metrics array
              const userMetric = user.metrics.find(m => m.metricId === kpi.id);
              return {
                metricId: kpi.id,
                value: userMetric ? userMetric.value : 0
              };
            });
            
            return {
              userId: user.userId,
              fullName: user.fullName,
              metrics: metricsArray,
              assesmentDate: user.assesmentDate || user.created_at
            };
          });
          
          console.log('✅ Converted data:', convertedData.length, 'records');
          console.log('✅ Sample converted:', convertedData[0]);
          
          response = { data: { data: convertedData } };
        } else {
          // No division information available
          response = { data: { data: [] } };
        }
        
        // Format the data to match the expected structure and align with division-specific KPIs
        const formattedData = response.data.data.map((user) => {
          // Create metrics array aligned with the current kpiList order
          const metrics = kpiList.map((kpi) => {
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
        
        console.log('🎉 Final formatted data:', formattedData.length, 'records');
        console.log('🎉 Sample final data:', formattedData[0]);

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
  }, [kpiList, selectedDivision]);

  useEffect(() => {
    const currentUser = getUser();
    
    // Only fetch report data if we have KPIs loaded AND conditions are met
    if (kpiList.length > 0) {
      // For SUPERADMIN: require division selection before fetching data
      if (currentUser?.role === 'SUPERADMIN') {
        if (selectedDivision && selectedMonth) {
          fetchKPIReport(selectedMonth);
        }
      } else {
        // For regular users: fetch data when month is available (division is from user profile)
        if (selectedMonth) {
          fetchKPIReport(selectedMonth);
        }
      }
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
                  <p className="text-sm text-gray-400">Setelah memilih divisi, bulan akan otomatis diset ke bulan ini</p>
                </div>
              </div>
            );
          }
          
          // If no month selected yet (waiting for division selection)
          if (!selectedMonth) {
            return (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              </div>
            );
          }
          
          return (
            <div>
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
                {kpiList.length === 0 ? (
                  <tr>
                    <td colSpan={1} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p>Tidak ada KPI untuk divisi Anda</p>
                        <p className="text-sm">Silakan hubungi admin untuk menambahkan KPI</p>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={kpiList.length + 1} className="text-center py-8 text-gray-500">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="mt-10">
            <h1 className="text-[#6C6C6C] text-sm font-medium ">*Menu KPI Reports Individual memberikan gambaran lengkap performa setiap anggota berdasarkan rata-rata kontribusi mereka di seluruh proyek dalam periode tertentu, sebagai dasar evaluasi kinerja yang transparan dan terukur.</h1>
          </div>
            </div>
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
