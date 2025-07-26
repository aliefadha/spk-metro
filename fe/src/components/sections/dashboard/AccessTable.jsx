import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const AccessTable = () => {
  const [data, setData] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/user");
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
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-primer">
        Tabel Akses Pengguna
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50 text-left">
              <th className="px-4 py-3 text-primer">Nama Lengkap</th>
              <th className="px-4 py-3 text-primer">Email</th>
              <th className="px-4 py-3 text-primer">Level</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Tidak ada data pengguna.
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.email} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.level === "SUPERADMIN"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.level}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessTable;
