import { useState, useEffect } from "react";
import { Edit, Check, X } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const AssesmentTable = () => {
  const [assessments, setAssessments] = useState([]);
  const [data, setData] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({});

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

  // Fetch Assessments Data
  const fetchData = async () => {
    try {
      const response = await api.get(
        "http://localhost:3000/api/v1/assessments"
      );
      console.log("Response Data:", response.data);

      // Mapping metrics ke object agar mudah digunakan
      const formattedData = response.data.data.map((item) => ({
        userId: item.userId,
        fullName: item.fullName,
        metrics: item.metrics.reduce((acc, metric) => {
          acc[metric.metricId] = metric.value; // Simpan metric berdasarkan ID-nya
          return acc;
        }, {}),
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
  }, []);

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
                  <td key={kpi.id} className="px-4 py-3 text-left">
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
