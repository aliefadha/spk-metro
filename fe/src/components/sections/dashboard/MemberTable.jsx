import { useState, useEffect } from "react";
import { Edit, Trash2, Check } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const MemberTable = () => {
  const [data, setData] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    fullName: "",
    divisionId: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/member");
      setData(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetch("http://localhost:3000/api/v1/division")
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) setDivisions(data.data);
      })
      .catch((error) => console.error("Error fetching divisions:", error));
  }, []);

  const handleEdit = (id, fullName, divisionId) => {
    setIsEditing(id);
    setEditValues({ fullName, divisionId });
    setSelectedDivision(divisionId); // Menyimpan ID divisi yang sudah ada pada anggota
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await api.put(`http://localhost:3000/api/v1/member/${id}`, editValues);
      fetchData();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Perubahan",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
    setIsEditing(null);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus member ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`http://localhost:3000/api/v1/member/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Member berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: error.response?.data?.message || "Terjadi kesalahan.",
        });
      }
    }
  };

  const handleModal = () => setShowModal(!showModal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !selectedDivision) {
      Swal.fire({
        icon: "warning",
        title: "Form Belum Lengkap",
        text: "Harap isi semua data!",
      });
      return;
    }

    try {
      await api.post("http://localhost:3000/api/v1/member", {
        fullName,
        divisionId: selectedDivision,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Member berhasil ditambahkan!",
      });
      fetchData();
      handleModal();
      setFullName("");
      setSelectedDivision("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambah Member",
        text: error.response?.data?.message || "Terjadi kesalahan.",
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
          + Tambah Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Nomor Member</th>
              <th className="px-4 py-3 text-left text-primer">Nama Member</th>
              <th className="px-4 py-3 text-left text-primer">Divisi</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">#00{index + 1}</td>
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editValues.fullName}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-md"
                      autoFocus
                    />
                  ) : (
                    row.fullName
                  )}
                </td>

                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <select
                      name="divisionId"
                      value={editValues.divisionId}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-md"
                    >
                      <option value="">{row.division}</option>
                      {divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.divisionName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.division
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    {isEditing === row.id ? (
                      <button
                        className="p-1 hover:text-green-500"
                        onClick={() => handleSave(row.id)}
                      >
                        <Check className="w-5 h-5 text-green-500" />
                      </button>
                    ) : (
                      <button
                        className="p-1 hover:text-yellow-500"
                        onClick={() =>
                          handleEdit(row.id, row.fullName, row.divisionId)
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
            <h2 className="text-xl font-semibold mb-4">Tambah Member</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Nama Member
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Divisi</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                >
                  <option value="">Pilih Divisi</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.divisionName}
                    </option>
                  ))}
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

export default MemberTable;
