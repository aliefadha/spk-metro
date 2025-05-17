import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const SPKTable = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiList, setKpiList] = useState([]);

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
      {/* Matriks Keputusan */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <h2 className="text-xl font-semibold mr-3">1. Matriks Keputusan</h2>
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

      {/* Normalisasi Matriks */}
      <div
        className="flex flex-col sm:flex-row gap-2 mb-6"
        style={{ marginTop: "40px" }}
      >
        <h2 className="text-xl font-semibold mr-3">2. Normalisasi Matriks</h2>
      </div>

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

      {/* Menghitung nilai Si dan Ri*/}
      <div
        className="flex flex-col sm:flex-row gap-2 mb-6"
        style={{ marginTop: "40px" }}
      >
        <h2 className="text-xl font-semibold mr-3">
          3. Menghitung nilai Si dan Ri
        </h2>
      </div>

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

      {/* Menghitung Nilai Qi*/}
      <div
        className="flex flex-col sm:flex-row gap-2 mb-6"
        style={{ marginTop: "40px" }}
      >
        <h2 className="text-xl font-semibold mr-3">4. Menghitung Nilai Qi</h2>
      </div>

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

export default SPKTable;
