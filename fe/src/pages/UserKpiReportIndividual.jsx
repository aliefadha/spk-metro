import MainLayoutUser from "@/components/layouts/MainLayoutUser";
import KPIReportTableIndividual from "@/components/sections/dashboard/KPIReportTableIndividual";
import { Calculator } from "lucide-react";
import { useState, useEffect } from "react";

export default function KpiReportPageIndividual() {
  const [selectedMonth, setSelectedMonth] = useState("");
  
  // Function to get current month
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  // Set default month on component mount (since user page doesn't have division selector)
  useEffect(() => {
    setSelectedMonth(getCurrentMonth());
  }, []);

  return (
    <MainLayoutUser>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          <Calculator className="w-5 h-5 mr-2 text-primer " />
          KPI Reports Individual
        </h1>
        <input
          type="month"
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          placeholder="Filter berdasarkan bulan"
        />
      </div>
      <KPIReportTableIndividual selectedDivision="" selectedMonth={selectedMonth} />
    </MainLayoutUser>
  );
}
