import MainLayoutUser from "@/components/layouts/MainLayoutUser";
import KPIReportTableIndividual from "@/components/sections/dashboard/KPIReportTableIndividual";
import { Calculator } from "lucide-react";

export default function KpiReportPageIndividual() {
  return (
    <MainLayoutUser>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          <Calculator className="w-5 h-5 mr-2 text-primer " />
          KPI Reports Individual
        </h1>
        <select className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer py-1">
          <option value="001"> Filter berdasarkan divisi </option>
        </select>
        <button className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto">
          Export
        </button>
      </div>
      <KPIReportTableIndividual />
    </MainLayoutUser>
  );
}
