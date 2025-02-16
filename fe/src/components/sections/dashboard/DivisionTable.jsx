import { useState, useEffect } from "react";
import { Edit, Trash2, Check } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const DivisionTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [divisionName, setDivisionName] = useState("");
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

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

  const handleModal = () => {
    setShowModal(!showModal);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:3000/api/v1/division", {
        divisionName,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil Tambah Divisi!",
        text: "Divisi baru berhasil ditambahkan.",
        timer: 1000,
        showConfirmButton: false,
      });

      setShowModal(false);
      setDivisionName("");
      await fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Tambah Divisi",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan divisi.",
        timer: 2000,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus divisi ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`http://localhost:3000/api/v1/division/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Divisi berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus divisi.",
        });
      }
    }
  };

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleEditBlur = async (id) => {
    if (editName.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Nama tidak boleh kosong",
        timer: 2000,
      });
      return;
    }

    try {
      await api.put(`http://localhost:3000/api/v1/division/${id}`, {
        divisionName: editName,
      });

      Swal.fire({
        icon: "success",
        title: "Divisi diperbarui!",
        text: "Nama divisi berhasil diubah.",
        timer: 1000,
        showConfirmButton: false,
      });

      setEditingId(null);
      await fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengedit Divisi",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui divisi.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white ml-auto"
        >
          + Tambah Divisi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Nomor Divisi</th>
              <th className="px-4 py-3 text-left text-primer">Nama Divisi</th>
              <th className="px-4 py-3 text-left text-primer">
                Jumlah Anggota
              </th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">#00{index + 1}</td>
                <td className="px-4 py-3">
                  {editingId === row.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleEditBlur(row.id)}
                      className="border rounded px-2 py-1 w-full"
                      autoFocus
                    />
                  ) : (
                    row.divisionName
                  )}
                </td>
                <td className="px-4 py-3">{row.totalMember}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    {editingId === row.id ? (
                      <button
                        className="p-1 hover:text-green-500"
                        onClick={() => handleEditBlur(row.id)}
                      >
                        <Check className="w-5 h-5 text-green-500" />
                      </button>
                    ) : (
                      <button
                        className="p-1 hover:text-yellow-500"
                        onClick={() =>
                          handleEditClick(row.id, row.divisionName)
                        }
                      >
                        <Edit className="w-5 h-5 text-yellow-400" />
                      </button>
                    )}
                    <button
                      className="p-1 hover:text-red-600"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Divisi</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Nama Divisi
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={divisionName}
                  onChange={(e) => setDivisionName(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300"
                  onClick={handleModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primer text-white"
                >
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

export default DivisionTable;
