const KPITable = () => {
  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Laporan KPI Proyek</h2>
        <select className="px-4 py-2 rounded-lg bg-primer text-white min-w-[200px]">
          <option value="002">002 - E-Commerce Resong</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left">Nama Member</th>
              {[1, 2, 3, 4, 5].map((num) => (
                <th key={num} className="px-4 py-3 text-center text-primer">
                  Metrik{num}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-primer">Skor</th>
              <th className="px-4 py-3 text-center text-primer">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* {data.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.name}</td>
                {row.metrics.map((metric, idx) => (
                  <td key={idx} className="px-4 py-3 text-center">
                    {metric}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">{row.score}%</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      row.status === "Achieved"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPITable;
