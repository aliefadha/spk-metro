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
      </div>
      <KPIReportTableIndividual selectedDivision="" selectedMonth="" />
    </MainLayoutUser>
  );
}
