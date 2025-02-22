import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const KPIReportTableIndividual = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data KPI Report dari API
  const fetchKPIReport = async () => {
    try {
      const response = await api.get(
        "http://localhost:3000/api/v1/kpi-reports"
      );
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
    fetchKPIReport();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <h2 className="text-xl font-semibold mr-3">Data KPI Report</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">Nama Member</th>
                {reportData.length > 0 &&
                  reportData[0].metrics.map((_, index) => (
                    <th key={index} className="px-4 py-3 text-left text-primer">
                      Metrik {index + 1}
                    </th>
                  ))}
                <th className="px-4 py-3 text-left text-primer">Skor</th>
                <th className="px-4 py-3 text-left text-primer">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{row.fullName}</td>
                    {row.metrics.map((value, idx) => (
                      <td key={idx} className="px-4 py-3">
                        {value}
                      </td>
                    ))}
                    <td className="px-4 py-3">{row.totalSkor}</td>
                    <td
                      className={`px-4 py-3 ${
                        row.status === "Achieved"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {row.status}
                    </td>
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
