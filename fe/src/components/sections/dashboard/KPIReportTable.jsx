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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) {
          console.error("No user found");
          return;
        }

        // Get all projects and their collaborators
        const response = await api.get("http://localhost:3000/api/v1/projects");
        const allProjects = response.data.data || [];
        
        // Filter projects where current user is a collaborator (regardless of PM status)
        const userCollaboratorProjects = allProjects.filter(project => {
          // Check if current user is a collaborator in this project
          if (project.projectCollaborator && project.projectCollaborator.length > 0) {
            return project.projectCollaborator.some(collab => 
              collab.userId === currentUser.id
            );
          }
          return false;
        });

        setProjects(userCollaboratorProjects);
      } catch (error) {
        console.error("Gagal mengambil data project:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUsers();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedUser || !selectedProject) return;

    const fetchReport = async () => {
      try {
        const response = await api.post(
          "http://localhost:3000/api/v1/kpi-reports",
          { userId: selectedUser, projectId: selectedProject }
        );
        setReportData(response.data.data.reportData);
        setTotalSkor(response.data.data.totalSkor);
      } catch (error) {
        console.error("Gagal mengambil data KPI Report:", error);
      }
    };
    fetchReport();
  }, [selectedUser, selectedProject]);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <h2 className="text-xl font-semibold mr-3">Laporan KPI</h2>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 rounded-lg bg-primer text-white min-w-[200px]"
        >
          <option value="">Pilih Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.projectName}
            </option>
          ))}
        </select>

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-4 py-2 rounded-lg border border-primer bg-transparent text-primer min-w-[200px]"
        >
          <option value="">Pilih User</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && selectedUser && (
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

      {totalSkor !== null && (
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
                Skor KPI Total adalah : {totalSkor} ({reportData.every(row => row.status === "Achieved") ? "Achieved" : "Not Achieved"})
              </h2>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};


export default KPIReportTable;
