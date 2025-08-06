import { useState, useEffect } from "react";
import { Edit, Check, X } from "lucide-react";
import api from "@/utils/axios";
import { getUser } from "@/utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserAssesmentTable = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [kpiList, setKpiList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) {
          console.error("No user found");
          return;
        }

        // If user has divisionId, fetch KPIs for their division
        if (currentUser.divisionId) {
          const response = await api.get(`http://localhost:3000/api/v1/metrics/division?divisionId=${currentUser.divisionId}`);
          setKpiList(response.data.data);
        } else {
          // If no divisionId, fetch all KPIs (fallback)
          const response = await api.get("http://localhost:3000/api/v1/metrics");
          setKpiList(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
        // Fallback to fetch all KPIs if division-specific fetch fails
        try {
          const response = await api.get("http://localhost:3000/api/v1/metrics");
          setKpiList(response.data.data);
        } catch (fallbackError) {
          console.error("Gagal memuat KPI fallback:", fallbackError);
        }
      }
    };

    fetchKPI();
  }, []);

  // Fetch only projects where user is project manager
  const fetchUserProjects = async () => {
    try {
      const currentUser = getUser();
      if (!currentUser) {
        console.error("No user found");
        return;
      }

      // Use the new endpoint to get all projects where user is involved
      const projectsResponse = await api.get(`http://localhost:3000/api/v1/projects/user/${currentUser.id}`);
      const allUserProjects = projectsResponse.data.data || [];

      // Filter to only show projects where user is project manager
      const pmProjects = allUserProjects.filter(project => {
        if (project.projectCollaborator && project.projectCollaborator.length > 0) {
          return project.projectCollaborator.some(collab => 
            collab.userId === currentUser.id && collab.isProjectManager === true
          );
        }
        return false;
      });

              setUserProjects(pmProjects);
        
        // If no PM projects found, redirect to userkpiproject
        if (pmProjects.length === 0) {
          navigate('/userkpiproject');
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
        // Fallback to fetch all projects if the new endpoint fails
        try {
          const currentUser = getUser();
          if (!currentUser) {
            console.error("No user found in fallback");
            return;
          }
          
          const projectsResponse = await api.get("http://localhost:3000/api/v1/projects");
          const allProjects = projectsResponse.data.data || [];
          
          // Find projects where current user is project manager
          const pmProjects = allProjects.filter(project => {
            if (project.projectCollaborator && project.projectCollaborator.length > 0) {
              return project.projectCollaborator.some(collab => 
                collab.userId === currentUser.id && collab.isProjectManager === true
              );
            }
            return false;
          });

          setUserProjects(pmProjects);
          
          // If no PM projects found in fallback, redirect to userkpiproject
          if (pmProjects.length === 0) {
            navigate('/userkpiproject');
          }
        } catch (fallbackError) {
          console.error("Error fetching user projects fallback:", fallbackError);
          // If both main and fallback fail, redirect to userkpiproject
          navigate('/userkpiproject');
        }
      }
    };

  const fetchData = async (projectId = null) => {
    try {
      const currentUser = getUser();
      if (!currentUser) {
        console.error("No user found");
        // Fallback to fetch all assessments if no user
        const response = await api.get("http://localhost:3000/api/v1/assessments");
        const formattedData = response.data.data.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
          metrics: item.metrics.reduce((acc, metric) => {
            acc[metric.metricId] = metric.value;
            return acc;
          }, {}),
        }));
        setAssessments(formattedData);
        return;
      }

      try {
        let allMembers = [];
        let allAssessments = [];

        if (projectId) {
          // Get the specific project to find all members
          const project = userProjects.find(p => p.id === projectId);
          if (project && project.projectCollaborator) {
            // Get all members from the project
            allMembers = project.projectCollaborator.map(collab => ({
              userId: collab.userId,
              fullName: collab.user.fullName,
              isProjectManager: collab.isProjectManager
            }));
          }

          // Fetch assessments for specific project
          const assessmentResponse = await api.get(`http://localhost:3000/api/v1/assessments/project/${projectId}`);
          const projectAssessments = assessmentResponse.data.data || [];
          allAssessments = projectAssessments;
        } else {
          // For all projects, get all members and assessments
          for (const project of userProjects) {
            if (project.projectCollaborator) {
              const projectMembers = project.projectCollaborator.map(collab => ({
                userId: collab.userId,
                fullName: collab.user.fullName,
                isProjectManager: collab.isProjectManager
              }));
              allMembers.push(...projectMembers);
            }

            try {
              const assessmentResponse = await api.get(`http://localhost:3000/api/v1/assessments/project/${project.id}`);
              const projectAssessments = assessmentResponse.data.data || [];
              allAssessments.push(...projectAssessments);
            } catch (error) {
              console.error(`Error fetching assessments for project ${project.id}:`, error);
            }
          }
        }

        // If no projects found, show all assessments as fallback
        if (allMembers.length === 0 && userProjects.length === 0) {
          console.log("No projects found, showing all assessments");
          const response = await api.get("http://localhost:3000/api/v1/assessments");
          const formattedData = response.data.data.map((item) => ({
            userId: item.userId,
            fullName: item.fullName,
            metrics: item.metrics.reduce((acc, metric) => {
              acc[metric.metricId] = metric.value;
              return acc;
            }, {}),
          }));
          setAssessments(formattedData);
          return;
        }

        // Remove duplicate members (in case user is in multiple projects)
        const uniqueMembers = allMembers.filter((member, index, self) => 
          index === self.findIndex(m => m.userId === member.userId)
        );

        // Filter out project managers, keep only regular members
        const regularMembers = uniqueMembers.filter(member => !member.isProjectManager);

        // Create a map of assessment data by userId
        const assessmentMap = {};
        allAssessments.forEach((item) => {
          if (!assessmentMap[item.userId]) {
            assessmentMap[item.userId] = {
              userId: item.userId,
              fullName: item.fullName,
              metrics: {}
            };
          }
          item.metrics.forEach((metric) => {
            assessmentMap[item.userId].metrics[metric.metricId] = metric.value;
          });
        });

        // Merge members with their assessment data
        const formattedData = regularMembers.map((member) => ({
          userId: member.userId,
          fullName: member.fullName,
          isProjectManager: member.isProjectManager,
          metrics: assessmentMap[member.userId]?.metrics || {}
        }));

        console.log("Formatted Data with all members:", formattedData);
        setAssessments(formattedData);
      } catch (projectError) {
        console.error("Error fetching project data, falling back to all assessments:", projectError);
        // Fallback to fetch all assessments if project-based fetch fails
        const response = await api.get("http://localhost:3000/api/v1/assessments");
        const formattedData = response.data.data.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
          metrics: item.metrics.reduce((acc, metric) => {
            acc[metric.metricId] = metric.value;
            return acc;
          }, {}),
        }));
        setAssessments(formattedData);
      }
    } catch (error) {
      console.error("Gagal memuat data assessment:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data.",
      });
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, []);

  useEffect(() => {
    if (userProjects.length > 0) {
      fetchData();
    }
  }, [userProjects]);

  // Fungsi untuk masuk ke mode edit
  const handleEdit = (userId, metrics) => {
    setIsEditing(userId);
    setEditValues({ ...metrics });
  };

  // Fungsi untuk mengubah nilai input saat edit
  const handleEditChange = (metricId, newValue) => {
    setEditValues((prev) => ({
      ...prev,
      [metricId]: newValue,
    }));
  };

  // Fungsi untuk menyimpan perubahan
  const handleUpdate = async (userId) => {
    try {
      const updateData = {
        userId,
        assessments: Object.entries(editValues).map(([metricId, value]) => ({
          metricId,
          value: parseInt(value, 10) || 0, // Pastikan angka
        })),
      };

      await api.put("http://localhost:3000/api/v1/assessments", updateData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Assessment berhasil diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsEditing(null);
      fetchData(selectedProject || null); // Ambil ulang data setelah update
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui assessment.",
      });
    }
  };

  // Fungsi untuk membatalkan edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValues({});
  };



  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mb-6">Data Assessment</h2>
        <select 
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto"
          value={selectedProject}
          onChange={(e) => {
            setSelectedProject(e.target.value);
            fetchData(e.target.value || null);
          }}
        >
          <option value="">Semua Project</option>
          {userProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>
      </div>

      {selectedProject ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                {kpiList.map((kpi) => (
                  <th key={kpi.id} className="px-4 py-3 text-left text-primer">
                    {kpi.kpiName}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-primer">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((item) => (
                <tr key={item.userId} className="border-b">
                  <td className="px-4 py-3">{item.fullName}</td>

                  {/* Menampilkan data metric dengan key metricId */}
                  {kpiList.map((kpi) => (
                    <td key={kpi.id} className="px-4 py-3 text-center ">
                      {isEditing === item.userId ? (
                        <input
                          type="number"
                          value={editValues[kpi.id] || ""}
                          onChange={(e) =>
                            handleEditChange(kpi.id, e.target.value)
                          }
                          className="w-full border p-1 rounded"
                        />
                      ) : item.metrics[kpi.id] !== undefined ? (
                        item.metrics[kpi.id]
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                  
                  {/* Action buttons */}
                  <td className="px-4 py-3 text-center">
                    {isEditing === item.userId ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleUpdate(item.userId)}
                          className="text-green-600 hover:text-green-800"
                          title="Simpan"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800"
                          title="Batal"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      // Since we only show projects where user is PM, always show edit button
                      <button
                        onClick={() => handleEdit(item.userId, item.metrics)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Pilih project untuk melihat data assessment</p>
          <p className="text-sm mt-2">Menampilkan semua member project (dengan atau tanpa assessment)</p>
          <p className="text-sm mt-1">Hanya project yang Anda kelola sebagai Project Manager</p>
        </div>
      )}
    </div>
  );
};

export default UserAssesmentTable;
