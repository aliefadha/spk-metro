import { useState, useEffect } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ProjectTable = ({ selectedMonth }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal(!showModal);
  const [data, setData] = useState([]);

  const [anggota, setAnggota] = useState([]);
  const [selectedAnggota, setSelectedAnggota] = useState([]);
  const [selectedEditAnggota, setSelectedEditAnggota] = useState([]);

  // State untuk form tambah proyek
  const [formData, setFormData] = useState({
    projectName: "",
    bobot: "",
    deadline: "",
    tanggal_selesai: "",
    status: "BACKLOG",
    projectManager: "",
  });

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    projectName: "",
    bobot: "",
    deadline: "",
    tanggal_selesai: "",
    status: "",
    projectManager: "",
  });

  const fetchData = async () => {
    try {
      let url = "/v1/projects";
      
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      }

      const response = await api.get(url);

      const transformedData = response.data.data.map((project) => {
        const pm =
          project.projectCollaborator.find((col) => col.isProjectManager)?.user
            .fullName || "N/A";
        const anggotaList =
          project.projectCollaborator
            .filter((col) => !col.isProjectManager)
            .map((col) => col.user.fullName)
            .join(", ") || "N/A";

        return {
          ...project,
          pm,
          anggota: anggotaList,
        };
      });

      setData(transformedData);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      // Don't show error alert, just set empty data
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const response = await api.get("/v1/member?division=Developer");
        setAnggota(response.data.data);
      } catch (error) {
        console.error("Error fetching anggota:", error);
      }
    };

    fetchAnggota();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'projectManager') {
      setSelectedAnggota(prev => prev.filter(id => id !== value));
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setSelectedAnggota((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((id) => id !== value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate completion date if status is DONE
    if (formData.status === 'DONE' && !formData.tanggal_selesai) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Tanggal selesai wajib diisi untuk proyek dengan status DONE.",
      });
      return;
    }

    const pmId = formData.projectManager;

    const allCollaborators = [...new Set([...selectedAnggota, pmId])];

    const projectCollaborator = allCollaborators.map((id) => ({
      userId: id,
      isProjectManager: id === pmId,
    }));

    const newProject = {
      projectName: formData.projectName,
      bobot: parseFloat(formData.bobot),
      deadline: formData.deadline,
      tanggal_selesai: formData.tanggal_selesai || null,
      status: formData.status,
      projectCollaborator,
    };

    try {
      await api.post("/v1/project", newProject);
      Swal.fire("Sukses", "Proyek berhasil ditambahkan", "success");
      fetchData();
      setShowModal(false);
      setFormData({
        projectName: "",
        bobot: "",
        deadline: "",
        tanggal_selesai: "",
        status: "BACKLOG",
        projectManager: "",
      });
      setSelectedAnggota([]);
    } catch (error) {
      console.error("Gagal menambahkan proyek:", error);
      Swal.fire("Error", "Gagal menambahkan proyek", "error");
    }
  };

  // Fungsi untuk memulai mode edit
  const handleEdit = (project) => {
    setIsEditing(project.id);
    setEditValues({
      projectName: project.projectName,
      bobot: project.bobot,
      deadline: project.deadline,
      tanggal_selesai: project.tanggal_selesai || "",
      status: project.status,
      projectManager:
        project.projectCollaborator.find((col) => col.isProjectManager)
          ?.userId || "",
    });

    setSelectedEditAnggota(
      project.projectCollaborator
        .filter((col) => !col.isProjectManager)
        .map((col) => col.userId)
    );
  };

  const handleEditCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedEditAnggota((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((id) => id !== value);
      }
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // If changing project manager, remove the new PM from selected members
    if (name === 'projectManager') {
      setSelectedEditAnggota(prev => prev.filter(id => id !== value));
    }
    
    setEditValues({ ...editValues, [name]: value });
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValues({
      projectName: "",
      bobot: "",
      deadline: "",
      tanggal_selesai: "",
      status: "",
      projectManager: "",
    });
  };

  // Fungsi untuk menyimpan update melalui API PUT
  const handleUpdate = async (id) => {
    // Validate completion date if status is DONE
    if (editValues.status === 'DONE' && !editValues.tanggal_selesai) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tanggal selesai wajib diisi untuk proyek dengan status DONE.",
      });
      return;
    }

    try {
      const updatedProject = {
        projectName: editValues.projectName,
        bobot: parseFloat(editValues.bobot),
        deadline: editValues.deadline,
        tanggal_selesai: editValues.tanggal_selesai || null,
        status: editValues.status,
        projectCollaborator: [
          { userId: editValues.projectManager, isProjectManager: true },
          ...selectedEditAnggota.map((userId) => ({
            userId,
            isProjectManager: false,
          })),
        ],
      };

      await api.put(
        `/v1/project/${id}`,
        updatedProject
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Proyek berhasil diperbarui.",
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
          "Terjadi kesalahan saat memperbarui proyek.",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus project ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/v1/project/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Project berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus project.",
        });
      }
    }
  };

  // Filter data by divisionId if provided
  const filteredData = data;

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mr-3">Semua Divisi</h2>
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white ml-auto"
        >
          + Tambah Proyek
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">No</th>
              <th className="px-4 py-3 text-left text-primer">Nama Proyek</th>
              <th className="px-4 py-3 text-left text-primer">Bobot</th>
              <th className="px-4 py-3 text-left text-primer">Deadline</th>
              <th className="px-4 py-3 text-left text-primer">PM</th>
              <th className="px-4 py-3 text-left text-primer">Anggota</th>
              <th className="px-4 py-3 text-left text-primer">Status</th>
              <th className="px-4 py-3 text-left text-primer">Tanggal Selesai</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">
                  #00{filteredData.indexOf(row) + 1}
                </td>
                {/* Nama Proyek */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <input
                      type="text"
                      name="projectName"
                      value={editValues.projectName}
                      onChange={handleEditChange}
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    row.projectName
                  )}
                </td>

                {/* Bobot */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <input
                      type="number"
                      name="bobot"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editValues.bobot}
                      onChange={handleEditChange}
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    row.bobot
                  )}
                </td>

                {/* Deadline */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <input
                      type="date"
                      name="deadline"
                      value={editValues.deadline}
                      onChange={handleEditChange}
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    row.deadline
                  )}
                </td>

                {/* PM */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <select
                      name="projectManager"
                      value={editValues.projectManager}
                      onChange={handleEditChange}
                      className="w-full border p-1 rounded"
                    >
                      <option value="">Pilih PM</option>
                      {anggota.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.fullName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.pm
                  )}
                </td>

                {/* Anggota */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <div className="flex flex-wrap gap-2">
                      {anggota
                        .filter((item) => item.id !== editValues.projectManager)
                        .map((item) => (
                          <label key={item.id} className="flex items-center">
                            <input
                              type="checkbox"
                              value={item.id}
                              checked={selectedEditAnggota.includes(item.id)}
                              onChange={handleEditCheckboxChange}
                              className="mr-2"
                            />
                            {item.fullName}
                          </label>
                        ))}
                    </div>
                  ) : (
                    row.anggota
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <select
                      name="status"
                      value={editValues.status}
                      onChange={handleEditChange}
                      className="w-full border p-1 rounded"
                    >
                      <option value="BACKLOG">Backlog</option>
                      <option value="ONPROGRESS">On Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        row.status === "DONE"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  )}
                </td>

                {/* Tanggal Selesai */}
                <td className="px-4 py-3">
                  {isEditing === row.id ? (
                    <input
                      type="date"
                      name="tanggal_selesai"
                      value={editValues.tanggal_selesai}
                      onChange={handleEditChange}
                      className={`w-full border p-1 rounded ${
                        editValues.status !== 'DONE' ? 'bg-gray-100' : ''
                      }`}
                      disabled={editValues.status !== 'DONE'}
                      required={editValues.status === 'DONE'}
                    />
                  ) : (
                    row.tanggal_selesai || "-"
                  )}
                </td>

                {/* Aksi */}
                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    {isEditing === row.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(row.id)}
                          className="p-1 hover:text-green-500"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
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
                          onClick={() => handleDelete(row.id)}
                          className="p-1 hover:text-red-600"
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

      {/* Modal tambah proyek */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Proyek</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label className="w-1/3 text-sm font-medium">
                  Nama Proyek*
                </label>
                <input
                  type="text"
                  name="projectName"
                  className="w-full border p-2 rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-1/3 text-sm font-medium">Bobot*</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="bobot"
                  className="w-full border p-2 rounded-md"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-1/3 text-sm font-medium">Deadline*</label>
                <input
                  type="date"
                  name="deadline"
                  className="w-full border p-2 rounded-md"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-1/3 text-sm font-medium">PM*</label>
                <select
                  name="projectManager"
                  className="w-full border p-2 rounded-md"
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih PM</option>
                  {anggota.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Anggota*
                </label>
                <div className="flex flex-wrap gap-4">
                  {anggota
                    .filter((item) => item.id !== formData.projectManager)
                    .map((item) => (
                      <div key={item.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          value={item.id}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label>{item.fullName}</label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-1/3 text-sm font-medium">Status*</label>
                <select
                  name="status"
                  className="w-2/3 border p-2 rounded-md"
                  onChange={handleChange}
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="ONPROGRESS">On Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              {formData.status === 'DONE' && (
                <div className="mb-4 flex items-center">
                  <label className="w-1/3 text-sm font-medium">
                    Tanggal Selesai*
                  </label>
                  <input
                    type="date"
                    name="tanggal_selesai"
                    className="w-2/3 border p-2 rounded-md"
                    onChange={handleChange}
                    value={formData.tanggal_selesai}
                    required={formData.status === 'DONE'}
                  />
                </div>
              )}
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

ProjectTable.propTypes = {
  selectedMonth: PropTypes.string,
};

export default ProjectTable;
