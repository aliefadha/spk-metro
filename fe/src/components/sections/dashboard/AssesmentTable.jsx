import { useState, useEffect, useCallback } from "react";
import { Edit, Check, X, FileText } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
// PropTypes import removed: prop validation not used

const AssesmentTable = ({ selectedDivision, divisionName, selectedMonth }) => {
  const [assessments, setAssessments] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [divisionMembers, setDivisionMembers] = useState([]);

  // Fetch projects only if divisionName is Developer - filter only DONE projects
  useEffect(() => {
    if (divisionName !== "Developer") return;
    const fetchProjects = async () => {
      try {
        let url = "http://localhost:3000/api/v1/projects";
        
        // If selectedMonth is provided, use the new done projects endpoint
        if (selectedMonth) {
          url = `http://localhost:3000/api/v1/projects/done?month=${selectedMonth}`;
          const response = await api.get(url);
          setProjects(response.data.data || []);
        } else {
          // Fallback to original endpoint and filter client-side
          const response = await api.get(url);
          const doneProjects = (response.data.data || []).filter(project => project.status === "DONE");
          setProjects(doneProjects);
        }
      } catch (error) {
        console.error("Gagal memuat projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [divisionName, selectedMonth]);

  useEffect(() => {
    const fetchKPI = async () => {
      if (!selectedDivision || !divisionName) {
        setKpiList([]);
        return;
      }
      
      try {
        const url = `http://localhost:3000/api/v1/metrics/division?divisionId=${selectedDivision}`;
        const response = await api.get(url);
        setKpiList(response.data.data);
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
        setKpiList([]); // Set empty array on error
      }
    };
    fetchKPI();
  }, [selectedDivision, divisionName]);

  // Fetch collaborators only if divisionName is Developer
  useEffect(() => {
    if (divisionName !== "Developer") return;
    const fetchCollaborators = async () => {
      if (!selectedProject) {
        setCollaborators([]);
        return;
      }
      try {
        const response = await api.get(`http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`);
        setCollaborators(response.data.data || []);
      } catch (error) {
        console.error("Error fetching collaborators:", error);
        setCollaborators([]);
      }
    };
    fetchCollaborators();
  }, [selectedProject, divisionName]);

  // Fetch division members for non-developer divisions
  useEffect(() => {
    if (divisionName === "Developer" || !divisionName) return;
    
    const fetchDivisionMembers = async () => {
      try {
        const response = await api.get(`/v1/member?division=${divisionName}`);
        setDivisionMembers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching division members:", error);
        setDivisionMembers([]);
      }
    };
    
    fetchDivisionMembers();
  }, [divisionName]);

  const fetchData = useCallback(async () => {
    try {
      let url;
      if (divisionName === "Developer") {
        if (!selectedProject) {
          return;
        }
        url = `http://localhost:3000/api/v1/assessments/project/${selectedProject}`;
        const response = await api.get(url);

        let formattedData = response.data.data.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
          assesmentDate: item.assesmentDate,
          metrics: Array.isArray(item.metrics)
            ? item.metrics.reduce((acc, metric) => {
                acc[metric.metricId] = metric.value;
                return acc;
              }, {})
            : item.metrics,
        }));

        // Apply client-side month filtering if selectedMonth is provided
        if (selectedMonth) {
          formattedData = formattedData.filter((item) => {
            if (!item.assesmentDate) return false;
            
            try {
              const itemDate = new Date(item.assesmentDate);
              const selectedDate = new Date(selectedMonth + '-01');
              
              return itemDate.getFullYear() === selectedDate.getFullYear() &&
                     itemDate.getMonth() === selectedDate.getMonth();
            } catch (error) {
              console.error("Error parsing date:", item.assesmentDate, error);
              return false;
            }
          });
        }

        setAssessments(formattedData);
      } else {
        url = `http://localhost:3000/api/v1/assessments-nondev/division/${divisionName}`;
        
        // Add month query parameter if selectedMonth is provided
        if (selectedMonth) {
          url += `?month=${selectedMonth}`;
        }
        
        const response = await api.get(url);

        let formattedData = response.data.data.map((item) => ({
          userId: item.userId,
          fullName: item.fullName,
          assesmentDate: item.assesmentDate,
          created_at: item.created_at,
          metrics: Array.isArray(item.metrics)
            ? item.metrics.reduce((acc, metric) => {
                acc[metric.metricId] = metric.value;
                return acc;
              }, {})
            : item.metrics,
        }));

        setAssessments(formattedData);
      }
    } catch (error) {
      console.error("Gagal memuat data assessment atau anggota:", error);
      setAssessments([]);
    }
  }, [selectedProject, divisionName, selectedMonth]);

  useEffect(() => {
    if (divisionName === "Developer") {
      fetchData();
    } else if (divisionName) {
      // Only fetch if divisionName is set (not empty)
      fetchData();
    }
  }, [selectedProject, divisionName, selectedMonth, fetchData]);

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
          assesmentDate: selectedMonth ? `${selectedMonth}-01` : new Date().toISOString().split('T')[0],
        })),
        ...(divisionName === "Developer" && selectedProject ? { projectId: selectedProject } : {}),
      };

      const url =
        divisionName === "Developer"
          ? "http://localhost:3000/api/v1/assessments"
          : "http://localhost:3000/api/v1/assessments-nondev";

      await api.put(url, updateData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Assessment berhasil diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsEditing(null);
      fetchData(); // Ambil ulang data setelah update
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

  let filteredAssessments = assessments;
  
  if (divisionName === "Developer" && selectedProject && collaborators.length > 0) {
    const collaboratorIds = collaborators.map((c) => c.userId);
    filteredAssessments = filteredAssessments.filter((item) =>
      collaboratorIds.includes(item.userId)
    );
  } else if (divisionName && divisionName !== "Developer" && divisionMembers.length > 0) {
    // For non-developer divisions, show all division members even if they don't have assessment data
    const existingUserIds = assessments.map(item => item.userId);
    const missingMembers = divisionMembers.filter(member => !existingUserIds.includes(member.id));
    
    // Add missing members with empty metrics
    const emptyMetrics = kpiList.reduce((acc, kpi) => {
      acc[kpi.id] = undefined;
      return acc;
    }, {});
    
    const additionalMembers = missingMembers.map(member => ({
      userId: member.id,
      fullName: member.fullName,
      assesmentDate: null,
      metrics: emptyMetrics
    }));
    
    filteredAssessments = [...assessments, ...additionalMembers];
  }

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <h2 className="text-xl font-semibold mr-5">
          {divisionName ? `Divisi ${divisionName}` : "Semua Divisi"}
          {selectedMonth && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              - {new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
            </span>
          )}
        </h2>
        {divisionName === "Developer" && (
          <div className="flex flex-col">
            <select
              className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="">Filter berdasarkan proyek</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>
            {projects.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedMonth 
                  ? `Tidak ada proyek DONE pada ${new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}`
                  : "Tidak ada proyek dengan status DONE"
                }
              </p>
            )}
          </div>
        )}
      </div>

      {selectedDivision && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                {kpiList.map((kpi) => (
                  <th key={kpi.id} className="px-4 py-3 text-center text-primer">
                    {kpi.kpiName}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-primer">Aksi</th>
              </tr>
            </thead>
          <tbody>
            {!selectedDivision ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>Silakan pilih divisi terlebih dahulu untuk melihat assessment</p>
                  </div>
                </td>
              </tr>
            ) : kpiList.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>Tidak ada KPI untuk divisi {divisionName}</p>
                    <p className="text-sm">Silakan tambahkan KPI untuk divisi ini terlebih dahulu</p>
                  </div>
                </td>
              </tr>
            ) : filteredAssessments.length === 0 ? (
              <tr>
                <td colSpan={kpiList.length + 2} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>Tidak ada data assessment untuk {divisionName}</p>
                    {divisionName === "Developer" && !selectedProject && (
                      <p className="text-sm">Silakan pilih project terlebih dahulu</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAssessments.map((item) => (
                <tr key={item.userId} className="border-b">
                  <td className="px-4 py-3">{item.fullName}</td>
                  {kpiList.map((kpi) => (
                    <td key={kpi.id} className="px-4 py-3 text-center ">
                      {isEditing === item.userId ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
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

                  <td className="px-4 py-3">
                    <div className="flex space-x-4">
                      {isEditing === item.userId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(item.userId)}
                            className="p-1 hover:text-green-500"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 hover:text-red-600"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.userId, item.metrics)}
                          className="p-1 hover:text-yellow-500"
                        >
                          <Edit className="w-5 h-5 text-yellow-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
      
      {!selectedDivision && (
        <div className="text-center py-12 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <FileText className="w-16 h-16 text-gray-300" />
            <p className="text-lg">Silakan pilih divisi terlebih dahulu</p>
            <p className="text-sm">Untuk melihat data assessment, pilih divisi dari dropdown di atas</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default AssesmentTable;
