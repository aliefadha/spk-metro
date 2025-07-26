import { useState, useEffect } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const TableKPI = ({ divisionId, divisionName }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    kodeKpi: "",
    kpiName: "",
    target: "",
    bobot: "",
    char: "",
  });
  const [data, setData] = useState([]);

  const handleModal = () => setShowModal(!showModal);

  // State untuk form tambah
  const [kpiName, setkpiName] = useState("");
  const [target, settarget] = useState("");
  const [bobot, setBobot] = useState("");
  const [char, setChar] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      let url = "http://localhost:3000/api/v1/metrics";
      
      if (divisionId) {
        url = `http://localhost:3000/api/v1/metrics/division?divisionId=${divisionId}`;
      }
      
      const response = await api.get(url);

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
  }, [divisionId]);

  // Fungsi Edit
  const handleEdit = (metric) => {
    setIsEditing(metric.id);
    setEditValues({
      kodeKpi: metric.kodeKpi,
      kpiName: metric.kpiName,
      target: metric.target,
      bobot: metric.bobot,
      char: metric.char,
    });
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValues({
      kodeKpi: "",
      kpiName: "",
      target: "",
      bobot: "",
      char: "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`http://localhost:3000/api/v1/metrics/${id}`, {
        ...editValues,
        target: parseFloat(editValues.target),
        bobot: parseFloat(editValues.bobot),
        divisionId,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "KPI berhasil diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchData();
      setIsEditing(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui KPI.",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus KPI ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`http://localhost:3000/api/v1/metrics/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "KPI berhasil dihapus.",
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
            "Terjadi kesalahan saat menghapus KPI.",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!kpiName.trim()) {
      newErrors.kpiName = "Nama KPI wajib diisi";
    }

    if (!target || parseFloat(target) <= 0) {
      newErrors.target = "Target harus berupa angka positif";
    }

    if (!bobot || parseFloat(bobot) <= 0) {
      newErrors.bobot = "Bobot harus berupa angka positif";
    }

    if (!char) {
      newErrors.char = "Karakteristik wajib dipilih";
    }

    if (!divisionId) {
      newErrors.divisionId = "Silakan pilih divisi terlebih dahulu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("http://localhost:3000/api/v1/metrics", {
        kpiName,
        target: parseFloat(target),
        bobot: parseFloat(bobot),
        char,
        divisionId,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "KPI berhasil ditambahkan!",
        });
        fetchData();
        handleModal();
        setkpiName("");
        settarget("");
        setBobot("");
        setChar("");
        setErrors({});
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ 
          submit: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi." 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter data by divisionId if provided (fallback if server-side filtering fails)
  const filteredData = divisionId ? data.filter((row) => row.divisionId === divisionId) : data;

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mr-3">
          {divisionName ? `KPI Divisi ${divisionName}` : "Semua KPI"}
        </h2>
        {divisionId && (
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white  ml-auto"
        >
          + Tambah KPI
        </button>
        )}
      </div>

      {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-primer">ID KPI</th>
                <th className="px-4 py-3 text-left text-primer">Nama KPI </th>
                <th className="px-4 py-3 text-left text-primer">Karakteristik</th>
                <th className="px-4 py-3 text-left text-primer">Bobot</th>
                <th className="px-4 py-3 text-left text-primer">Target</th>
                <th className="px-4 py-3 text-left text-primer">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3">
                    {isEditing === row.id ? (
                      <input
                        type="text"
                        name="kodeKpi"
                        value={editValues.kodeKpi}
                        onChange={handleEditChange}
                        className="w-full border p-1 rounded bg-gray-100"
                        disabled
                      />
                    ) : (
                      row.kodeKpi
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing === row.id ? (
                      <input
                        type="text"
                        name="kpiName"
                        value={editValues.kpiName}
                        onChange={handleEditChange}
                        className="w-full border p-1 rounded"
                      />
                    ) : (
                      row.kpiName
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing === row.id ? (
                      <select
                        name="char"
                        value={editValues.char}
                        onChange={handleEditChange}
                        className="w-full border p-1 rounded"
                      >
                        <option value="Benefit">Benefit</option>
                        <option value="Cost">Cost</option>
                      </select>
                    ) : (
                      row.char
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing === row.id ? (
                      <input
                        type="number"
                        name="bobot"
                        value={editValues.bobot}
                        onChange={handleEditChange}
                        className="w-full border p-1 rounded"
                      />
                    ) : (
                      row.bobot
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing === row.id ? (
                      <input
                        type="number"
                        name="target"
                        value={editValues.target}
                        onChange={handleEditChange}
                        className="w-full border p-1 rounded"
                      />
                    ) : (
                      `${row.target}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-4">
                      {isEditing === row.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(row.id)}
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
                        <>
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-1 hover:text-yellow-500"
                          >
                            <Edit className="w-5 h-5 text-yellow-400" />
                          </button>
                          <button
                            className="p-1 hover:text-red-600"
                            onClick={() => handleDelete(row.id)}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </>
                      )}
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
            <h2 className="text-xl font-semibold mb-4">Tambah KPI</h2>
            
            {/* Global Error Message */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {errors.submit}
              </div>
            )}

            {/* Division Selection Warning */}
            {errors.divisionId && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                {errors.divisionId}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Nama KPI*
                </label>
                <input
                  type="text"
                  value={kpiName}
                  onChange={(e) => setkpiName(e.target.value)}
                  className={`w-full border p-2 rounded-md ${
                    errors.kpiName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.kpiName && (
                  <p className="text-red-500 text-sm mt-1">{errors.kpiName}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Karakteristik*
                </label>
                <select
                  className={`w-full border p-2 rounded-md ${
                    errors.char ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={char}
                  onChange={(e) => setChar(e.target.value)}
                >
                  <option value="">Pilih Karakteristik</option>
                  <option value="Benefit">Benefit</option>
                  <option value="Cost">Cost</option>
                </select>
                {errors.char && (
                  <p className="text-red-500 text-sm mt-1">{errors.char}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Bobot*</label>
                <input
                  type="number"
                  step="0.01"
                  value={bobot}
                  onChange={(e) => setBobot(e.target.value)}
                  className={`w-full border p-2 rounded-md ${
                    errors.bobot ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bobot && (
                  <p className="text-red-500 text-sm mt-1">{errors.bobot}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Target*
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={target}
                  onChange={(e) => settarget(e.target.value)}
                  className={`w-full border p-2 rounded-md ${
                    errors.target ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.target && (
                  <p className="text-red-500 text-sm mt-1">{errors.target}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
                  onClick={handleModal}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primer text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


TableKPI.propTypes = {
  divisionId: PropTypes.string,
  divisionName: PropTypes.string,
};

export default TableKPI;
