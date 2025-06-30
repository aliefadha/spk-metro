import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const KPIReportTableIndividual = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiList, setKpiList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // Fetch KPI Metrics
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

  // Fetch project list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/projects");
        setProjects(response.data.data);
      } catch (error) {
        console.error("Gagal memuat projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch data KPI Report dari API
  const fetchKPIReport = async (projectId = "") => {
    try {
      let response;
      if (projectId) {
        response = await api.get(
          `http://localhost:3000/api/v1/kpi-reports?projectId=${projectId}`
        );
      } else {
        response = await api.get(
          "http://localhost:3000/api/v1/kpi-reports"
        );
      }
      setReportData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data KPI Report:", error);
      setError("Gagal mengambil data");
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data KPI Report.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchKPIReport(selectedProject);
    // eslint-disable-next-line
  }, [selectedProject]);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <h2 className="text-xl font-semibold mr-3">Laporan KPI Proyek</h2>
        <select
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer min-w-[200px]"
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
        >
          <option value="">Pilih Proyek</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>
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
              {reportData.length > 0 ? (
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
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Tidak ada data KPI Report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KPIReportTableIndividual;
