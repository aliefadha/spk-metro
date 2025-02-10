import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProjectTable = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => setShowModal(!showModal);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Divisi Developer</h2>
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white"
        >
          + Tambah Proyek
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">ID Proyek</th>
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
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.nama_proyek}</td>
                <td className="px-4 py-3">{row.bobot}</td>
                <td className="px-4 py-3">{row.deadline}</td>
                <td className="px-4 py-3">{row.pm}</td>
                <td className="px-4 py-3">{row.anggota}</td>
                <td className="px-4 py-3 text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    row.status === 'Done' 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {row.status}
                  </span>
                </td>
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
            <h2 className="text-xl font-semibold mb-4">Tambah Proyek</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Nama Proyek*</label>
                <input type="text" className="w-full border p-2 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Bobot*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Deadline*</label>
                <input type="date" className="w-full border p-2 rounded-md"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">PM*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Anggota*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Status*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
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

export default ProjectTable;
