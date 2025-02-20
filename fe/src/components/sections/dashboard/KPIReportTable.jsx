import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const KPIReportTable = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal(!showModal);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mr-3">Divisi Developer</h2>
        <select className="px-4 py-2 rounded-lg bg-primer text-white min-w-[200px] ">
          <option value="002">002 - E-Commerce Resong</option>
        </select>
        <select className="px-4 py-2 rounded-lg border border-primer bg-transparent text-primer min-w-[200px] ">
          <option value="002">Reza</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Metrik</th>
              <th className="px-4 py-3 text-left text-primer">Bobot </th>
              <th className="px-4 py-3 text-left text-primer">Target</th>
              <th className="px-4 py-3 text-left text-primer">Skor Aktual</th>
              <th className="px-4 py-3 text-left text-primer">Skor Akhir</th>
              <th className="px-4 py-3 text-left text-primer">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.nama_divisi}</td>
                <td className="px-4 py-3">{row.jumlah_anggota}</td>
                <td className="px-4 py-3">{row.jumlah_anggota}</td>
                <td className="px-4 py-3">{row.jumlah_anggota}</td>
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
                <label className="block mb-2 text-sm font-medium">
                  Nama Proyek*
                </label>
                <input type="text" className="w-full border p-2 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Bobot*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Deadline*
                </label>
                <input type="date" className="w-full border p-2 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">PM*</label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Anggota*
                </label>
                <select className="w-full border p-2 rounded-md">
                  <option value="001"></option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Status*
                </label>
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

export default KPIReportTable;
