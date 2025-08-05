import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { getUser } from "@/utils/auth";
import Card from "react-bootstrap/Card";

const KPIReportTable = () => {
  const [selectedProject, setSelectedProject] = useState(""); // Simpan projectId
  const [selectedUser, setSelectedUser] = useState(""); // Simpan userId
  const [projects, setProjects] = useState([]); // Data project dropdown
  const [users, setUsers] = useState([]); // Data user dropdown
  const [reportData, setReportData] = useState([]); // Data KPI Report
  const [totalSkor, setTotalSkor] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isProjectManager, setIsProjectManager] = useState(false);
  const [userProjects, setUserProjects] = useState([]); // All projects related to user

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUserRole(currentUser.role);
      setCurrentUserId(currentUser.id);
    }
  }, []);

  // First, fetch all projects related to the user
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) {
          console.error("No user found");
          return;
        }

        let allProjects = [];

        if (currentUser.role === "SUPERADMIN") {
          // Superadmin can see all projects
          const response = await api.get("http://localhost:3000/api/v1/projects");
          allProjects = response.data.data || [];
        } else if (currentUser.role === "MEMBER") {
          // Member can see projects they're involved in (either as PM or member)
          const response = await api.get(`http://localhost:3000/api/v1/projects/user/${currentUser.id}`);
          allProjects = response.data.data || [];
        }

        setUserProjects(allProjects);
        setProjects(allProjects);
        
        // Set first project as default if projects exist
        if (allProjects.length > 0) {
          setSelectedProject(allProjects[0].id);
          // For MEMBER users, also set their own user ID
          if (currentUser.role === "MEMBER") {
            setSelectedUser(currentUser.id);
          }
        } else {
          // Handle case where user has no projects
          setSelectedProject("");
          setSelectedUser("");
        }
      } catch (error) {
        console.error("Gagal mengambil data project:", error);
      }
    };
    fetchUserProjects();
  }, [userRole, currentUserId]);

  // Then, check PM status for the selected project
  useEffect(() => {
    if (!selectedProject || userProjects.length === 0) {
      setIsProjectManager(false);
      return;
    }

    const checkPMStatus = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) return;

        // Find the selected project from userProjects
        const selectedProjectData = userProjects.find(project => project.id === selectedProject);
        
        if (selectedProjectData) {
          // Check if current user is PM for this project
          const currentUserCollaborator = selectedProjectData.projectCollaborator.find(
            col => col.userId === currentUser.id
          );
          
          const isPM = currentUserCollaborator?.isProjectManager || false;
          setIsProjectManager(isPM);
        }
      } catch (error) {
        console.error("Gagal mengecek status PM:", error);
        setIsProjectManager(false);
      }
    };

    checkPMStatus();
  }, [selectedProject, userProjects, currentUserId]);

  useEffect(() => {
    if (!selectedProject) {
      setIsProjectManager(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const currentUser = getUser();
        let projectUsers = [];

        if (currentUser.role === "SUPERADMIN") {
          // Superadmin can see all users in the project
          const response = await api.get(
            `http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`
          );
          projectUsers = response.data.data;
        } else if (currentUser.role === "MEMBER") {
          // Use the isProjectManager state that was set in the previous useEffect
          if (isProjectManager) {
            // If user is PM, they can see all members of the project
            const response = await api.get(
              `http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`
            );
            projectUsers = response.data.data;
          } else {
            // If user is not PM, they can only see their own data
            projectUsers = [{
              userId: currentUser.id,
              fullName: currentUser.fullName
            }];
            // Automatically set their own user ID
            setSelectedUser(currentUser.id);
          }
        }

        setUsers(projectUsers);
        
        // Set first user as default if users exist
        if (projectUsers.length > 0) {
          setSelectedUser(projectUsers[0].userId);
        } else {
          setSelectedUser(""); // Clear selection if no users
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUsers();
  }, [selectedProject, userRole, currentUserId, isProjectManager]);

  useEffect(() => {
    if (!selectedUser || !selectedProject) return;

    const fetchReport = async () => {
      try {
        // First get KPI report data for the user
        const response = await api.post(
          "http://localhost:3000/api/v1/kpi-reports",
          { userId: selectedUser, projectId: selectedProject }
        );
        
        // If we have report data, extract the metrics and get division info for those metrics
        if (response.data.data.reportData && response.data.data.reportData.length > 0) {
          const reportData = response.data.data.reportData;
          const metricIds = reportData.map(item => item.metricId);
          
          // Get all metrics to find which division they belong to
          const allMetricsResponse = await api.get("http://localhost:3000/api/v1/metrics");
          const allMetrics = allMetricsResponse.data.data;
          // Filter metrics that are in the report data
          const reportMetrics = allMetrics.filter(metric => metricIds.includes(metric.id));
          
          // Get the division of the first metric (assuming all metrics in a user's report belong to same division)
          const userDivisionId = reportMetrics.length > 0 ? reportMetrics[0].divisionId : null;
          
          // Now get all metrics for this user's division
          if (userDivisionId) {
            const divisionMetricsResponse = await api.get(
              `http://localhost:3000/api/v1/metrics/division?divisionId=${userDivisionId}`
            );
            const allDivisionMetrics = divisionMetricsResponse.data.data;
            
            // Filter report data to only include metrics from user's division
            const filteredReportData = reportData.filter(reportItem => {
              return allDivisionMetrics.some(metric => metric.id === reportItem.metricId);
            });
            
            setReportData(filteredReportData);
            
            // Recalculate total score for division metrics only
            let totalBobot = 0;
            let totalSkorBerbobot = 0;
            
            filteredReportData.forEach(item => {
              totalBobot += item.bobot;
              totalSkorBerbobot += parseFloat(item.skorAkhir) * item.bobot;
            });
            
            const recalculatedTotalSkor = totalBobot > 0 ? (totalSkorBerbobot / totalBobot).toFixed(2) : "0.00";
            setTotalSkor(recalculatedTotalSkor);
          } else {
            // If no division found, show all report data
            setReportData(reportData);
            setTotalSkor(response.data.data.totalSkor);
          }
        } else {
          setReportData([]);
          setTotalSkor("0.00");
        }
        
      } catch (error) {
        console.error("Gagal mengambil data KPI Report:", error);
      }
    };
    fetchReport();
  }, [selectedUser, selectedProject]);



  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className={`flex flex-col sm:flex-row gap-2 ${userRole === "MEMBER" ? "justify-between" : ""} mb-6`}>
        <h2 className="text-xl font-semibold mr-3">
          Laporan KPI
        </h2>

        {(userRole === "SUPERADMIN" || userRole === "MEMBER") && (
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 rounded-lg bg-primer text-white min-w-[200px]"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.projectName}
              </option>
            ))}
          </select>
        )}

        {(userRole === "SUPERADMIN" || (userRole === "MEMBER" && isProjectManager)) && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 rounded-lg border border-primer bg-transparent text-primer min-w-[200px]"
          >
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.fullName}
              </option>
            ))}
          </select>
        )}
      </div>

      {!selectedUser && userRole === "SUPERADMIN" && (
        <div className="text-center py-8">
          <p className="text-gray-500">Please select a project and user to view KPI report</p>
        </div>
      )}

      {!selectedUser && userRole === "MEMBER" && isProjectManager && (
        <div className="text-center py-8">
          <p className="text-gray-500">Please select a user to view KPI report</p>
        </div>
      )}

      {!userRole && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading user information...</p>
        </div>
      )}

      {projects.length === 0 && userRole && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {userRole === "SUPERADMIN" && "No projects found in the system"}
            {userRole === "MEMBER" && "You are not assigned to any projects"}
          </p>
        </div>
      )}

      {selectedUser && reportData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading KPI data...</p>
        </div>
      )}

      {selectedUser && reportData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "12px" }}>
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Metrik</th>
                <th className="px-4 py-3 text-left text-primer">Bobot</th>
                <th className="px-4 py-3 text-left text-primer">Target</th>
                <th className="px-4 py-3 text-left text-primer">Skor Aktual</th>
                <th className="px-4 py-3 text-left text-primer">Skor Akhir</th>
                <th className="px-4 py-3 text-left text-primer">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((row) => (
                  <tr key={row.metricId} className="border-b">
                    <td className="px-4 py-3">{row.metricName}</td>
                    <td className="px-4 py-3">{row.bobot}</td>
                    <td className="px-4 py-3">{row.target}</td>
                    <td className="px-4 py-3">{row.skorAktual}</td>
                    <td className="px-4 py-3">{row.skorAkhir}</td>
                    <td
                      className={`px-4 py-3 ${
                        row.status === "Achieved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada data KPI untuk user ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && totalSkor !== null && reportData.length > 0 && (
        <div className="mt-6">
          <Card
            className="bg-primer text-white p-4 rounded-lg"
            style={{
              backgroundColor: "#7E0EFF",
              color: "white",
              borderRadius: "10px",
            }}
          >
            <Card.Body>
              <h2 className="text-lg font-semibold">
                Status KPI Keseluruhan: {reportData.every(row => row.status === "Achieved") ? "Achieved" : "Not Achieved"}
              </h2>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};


export default KPIReportTable;
