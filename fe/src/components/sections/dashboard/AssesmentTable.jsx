import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import api from "@/utils/axios";

const AssesmentTable = () => {
  const [assessments, setAssessments] = useState([]);
  const [data, setData] = useState([]);
  const [kpiList, setKpiList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/division");
      setData(response.data.data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
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
  }, []);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/metrics");
        const result = await response.json();
        setKpiList(result.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchKPI();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/assessments"
        );
        const result = await response.json();

        if (!response.ok)
          throw new Error(result.message || "Failed to fetch data");

        setAssessments(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mb-6">Data Assessment</h2>
        <select className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer py-1 ml-auto">
          <option value="000"> Filter berdasarkan divisi </option>
          {data.map((row) => (
            <option key={row.id} value={row.id}>
              {row.divisionName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Nama Member</th>
              {kpiList.map((kpi, index) => (
                <th key={index} className="px-4 py-3 text-left text-primer">
                  {kpi.kpiName}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3">{item.fullName}</td>
                {item.metrics.map((metric, i) => (
                  <td className="px-4 py-3 text-left" key={i}>
                    {metric !== null ? metric : "-"}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    <button className="p-1 hover:text-yellow-500">
                      <Edit className="w-5 h-5 text-yellow-400" />
                    </button>
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
