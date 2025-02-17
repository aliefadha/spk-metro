import React, { useState, useEffect } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";
import Select from "react-select";

const ProjectTable = () => {
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
    status: "BACKLOG",
    projectManager: "",
  });

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    projectName: "",
    bobot: "",
    deadline: "",
    status: "",
    projectManager: "",
  });

  const fetchData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/projects");

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

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/member");
        const data = await response.json();
        setAnggota(data.data);
      } catch (error) {
        console.error("Error fetching anggota:", error);
      }
    };

    fetchAnggota();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      status: formData.status,
      projectCollaborator,
    };

    try {
      await api.post("http://localhost:3000/api/v1/project", newProject);
      Swal.fire("Sukses", "Proyek berhasil ditambahkan", "success");
      fetchData();
      setShowModal(false);
      setFormData({
        projectName: "",
        bobot: "",
        deadline: "",
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
    setSelectedEditAnggota((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValues({
      projectName: "",
      bobot: "",
      deadline: "",
      status: "",
      projectManager: "",
    });
  };

  // Fungsi untuk menyimpan update melalui API PUT
  const handleUpdate = async (id) => {
    try {
      const updatedProject = {
        projectName: editValues.projectName,
        bobot: parseFloat(editValues.bobot),
        deadline: editValues.deadline,
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
        `http://localhost:3000/api/v1/project/${id}`,
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
        await api.delete(`http://localhost:3000/api/v1/project/${id}`);
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

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mr-3">Divisi Developer</h2>
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
              <th className="px-4 py-3 text-left text-primer">Nama Proyek</th>
              <th className="px-4 py-3 text-left text-primer">Bobot</th>
              <th className="px-4 py-3 text-left text-primer">Deadline</th>
              <th className="px-4 py-3 text-left text-primer">PM</th>
              <th className="px-4 py-3 text-left text-primer">Anggota</th>
              <th className="px-4 py-3 text-left text-primer">Status</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b">
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
                      {anggota.map((item) => (
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
                  max="10"
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
                  {anggota.map((item) => (
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

export default ProjectTable;
