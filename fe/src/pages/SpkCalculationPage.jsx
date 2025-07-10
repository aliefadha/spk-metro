import MainLayout from "@/components/layouts/MainLayout";
import SPKTable from "@/components/sections/dashboard/SPKTable";
import { Calculator } from "lucide-react";

export default function SpkCalculationPage() {
  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          {" "}
          <Calculator className="w-5 h-5 mr-2 text-primer " /> SPK Calculation
          </h1>
      </div>
      <SPKTable />
    </MainLayout>
  );
}
