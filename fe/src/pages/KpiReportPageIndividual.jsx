import MainLayout from "@/components/layouts/MainLayout";
import KPIReportTableIndividual from "@/components/sections/dashboard/KPIReportTableIndividual";
import { Calculator, Download } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function KpiReportPageIndividual() {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await api.get("/v1/division");
        if (!response.data.error) {
          // Include all divisions including Developer
          setDivisions(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  const handleExport = () => {
    // Export functionality - can be implemented based on requirements
    console.log("Export functionality to be implemented");
    // You can implement CSV, PDF, or Excel export here
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          <Calculator className="w-5 h-5 mr-2 text-primer " />
          KPI Reports Individual
        </h1>
        <select 
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <option value="">Filter berdasarkan divisi</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.divisionName}>
              {division.divisionName}
            </option>
          ))}
        </select>
        <input
          type="month"
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          placeholder="Filter berdasarkan bulan"
        />
      </div>
      <KPIReportTableIndividual selectedDivision={selectedDivision} selectedMonth={selectedMonth} />
    </MainLayout>
  );
}
