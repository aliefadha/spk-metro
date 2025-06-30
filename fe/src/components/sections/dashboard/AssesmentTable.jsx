import { useState, useEffect } from "react";
import { Edit, Check, X } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
// PropTypes import removed: prop validation not used

const AssesmentTable = ({ selectedDivision, divisionName }) => {
  const [assessments, setAssessments] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/projects");
        setProjects(response.data.data || []);
      } catch (error) {
        console.error("Gagal memuat projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/metrics");
        setKpiList(response.data.data);
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
      }
    };
    fetchKPI();
  }, []);

  useEffect(() => {
    const fetchCollaborators = async () => {
      if (!selectedProject) {
        setCollaborators([]);
        return;
      }
      try {
        const response = await api.get(`http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`);
        setCollaborators(response.data.data || []);
      } catch {
        setCollaborators([]);
      }
    };
    fetchCollaborators();
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      let url = "http://localhost:3000/api/v1/assessments";
      if (selectedProject) {
        url = `http://localhost:3000/api/v1/assessments/project/${selectedProject}`;
      }
      const response = await api.get(url);
      console.log("Response Data:", response.data);

      const formattedData = response.data.data.map((item) => ({
        userId: item.userId,
        fullName: item.fullName,
        metrics: Array.isArray(item.metrics)
          ? item.metrics.reduce((acc, metric) => {
              acc[metric.metricId] = metric.value;
              return acc;
            }, {})
          : item.metrics,
      }));

      console.log("Formatted Data for State:", formattedData);
      setAssessments(formattedData);
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
    fetchData();
  }, [selectedProject]);

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
          assesmentDate: new Date().toISOString().split('T')[0],
        })),
        ...(selectedProject ? { projectId: selectedProject } : {}),
      };

      console.log('Update assessment payload:', updateData);

      await api.put("http://localhost:3000/api/v1/assessments", updateData);

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

  // Filter assessments by selectedDivision if provided
  const filteredAssessments = selectedDivision
    ? assessments.filter((item) => item.divisionId === selectedDivision)
    : assessments;

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <h2 className="text-xl font-semibold mr-5">{divisionName ? `Divisi ${divisionName}` : "Semua Divisi"}</h2>
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
      </div>

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
            {filteredAssessments.map((item) => (
              <tr key={item.userId} className="border-b">
                <td className="px-4 py-3">{item.fullName}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AssesmentTable;
