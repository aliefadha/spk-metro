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
  });
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);



  const fetchData = async () => {
    try {
      const response = await api.get("/v1/member");
      setData(response.data.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await api.get("/v1/division");
      if (!response.data.error) {
        setDivisions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDivisions();
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
      await api.put(`/v1/member/${id}`, editValues);
      await fetchData();
      setIsEditing(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setIsEditing(null);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Perubahan",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  const handleDelete = async (id) => {
    console.log('🔥 DELETE TRIGGERED:', {
      id,
      deletingId,
      isLoading,
      itemExists: !!data.find(item => item.id === id),
      dataLength: data.length,
      timestamp: new Date().toISOString()
    });
    
    if (deletingId === id || isLoading || !data.find(item => item.id === id)) {
      console.log('🚫 DELETE BLOCKED:', {
        reason: deletingId === id ? 'Already deleting' : 
                isLoading ? 'Loading in progress' : 
                'Item not found',
        deletingId,
        isLoading,
        itemExists: !!data.find(item => item.id === id)
      });
      return;
    }
    
    console.log('✅ DELETE PROCEEDING with confirmation dialog');
    
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus member ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    console.log('📋 CONFIRMATION RESULT:', confirm.isConfirmed);

    if (confirm.isConfirmed) {
      console.log('🎯 STARTING DELETE PROCESS for ID:', id);
      setDeletingId(id);
      setIsLoading(true);
      
      // Optimistic update: immediately remove from UI
      const originalData = [...data];
      console.log('💾 BACKUP DATA:', originalData.length, 'items');
      setData(prevData => prevData.filter(item => item.id !== id));
      console.log('🗑️ OPTIMISTIC UPDATE: Removed item from UI');
      
      try {
        console.log('🌐 API DELETE REQUEST for ID:', id);
        const deleteResponse = await api.delete(`/v1/member/${id}`);
        console.log('✅ API DELETE SUCCESS:', deleteResponse.status);
        
        // Force component re-render
        setRefreshKey(prev => {
          const newKey = prev + 1;
          console.log('🔄 REFRESH KEY UPDATE:', prev, '->', newKey);
          return newKey;
        });
        
        // Fetch fresh data to ensure consistency
        console.log('📥 FETCHING FRESH DATA...');
        await fetchData();
        console.log('📥 FRESH DATA FETCHED');
        
        console.log('🎉 SHOWING SUCCESS MESSAGE');
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Member berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      } catch (error) {
        console.error('❌ DELETE ERROR:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          id
        });
        
        console.log('🔄 REVERTING OPTIMISTIC UPDATE');
        setData(originalData);
        
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: error.response?.data?.message || "Terjadi kesalahan.",
        });
      } finally {
        console.log('🧹 CLEANUP: Resetting states');
        setDeletingId(null);
        setIsLoading(false);
        console.log('✨ DELETE PROCESS COMPLETED for ID:', id);
      }
    } else {
      console.log('❌ DELETE CANCELLED by user');
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
      await api.post("/v1/member", {
        fullName,
        divisionId: selectedDivision,
      });
      await fetchData();
      handleModal();
      setFullName("");
      setSelectedDivision("");
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Member berhasil ditambahkan!",
        timer: 2000,
        showConfirmButton: false,
      });
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
        <table key={refreshKey} className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Nomor Member</th>
              <th className="px-4 py-3 text-left text-primer">Nama Member</th>
              <th className="px-4 py-3 text-left text-primer">Divisi</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(row => row && row.id) // Safety filter
              .map((row, index) => (
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
                        className={`p-1 hover:text-red-600 ${
                          deletingId === row.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id || isLoading}
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
