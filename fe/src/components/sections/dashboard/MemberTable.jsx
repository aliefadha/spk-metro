import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const MemberTable = () => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal(!showModal);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/member");
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

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white ml-auto"
        >
          + Tambah Member
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">ID Member</th>
              <th className="px-4 py-3 text-left text-primer">Nama Member</th>
              <th className="px-4 py-3 text-left text-primer">Divisi</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{row.fullName}</td>
                <td className="px-4 py-3">{row.divisionId}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    <button className="p-1 hover:text-yellow-500">
                      <Edit className="w-5 h-5 text-yellow-400" />
                    </button>
                    <button className="p-1 hover:text-red-600">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Member</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Nama Member
                </label>
                <input type="text" className="w-full border p-2 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Divisi</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="000"> Pilih Divisi </option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300"
                  onClick={handleModal}
                >
                  Batal
                </button>
                <button className="px-4 py-2 rounded-lg bg-primer text-white">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;
