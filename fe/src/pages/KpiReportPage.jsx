import MainLayout from "@/components/layouts/MainLayout";
import KPIReportTable from "@/components/sections/dashboard/KPIReportTable";
import { Calculator, Download } from "lucide-react";

export default function KpiReportPage() {
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
          KPI Reports Project
        </h1>
        <button 
          onClick={handleExport}
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto hover:bg-primer hover:text-white transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <KPIReportTable />
    </MainLayout>
  );
}
