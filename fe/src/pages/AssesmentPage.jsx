import MainLayout from "@/components/layouts/MainLayout";
import AssesmentTable from "@/components/sections/dashboard/AssesmentTable";
import { divisionData } from "@/data/data";
import { FileText } from "lucide-react";

export default function AssesmentPage() {
  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          <FileText className="w-5 h-5 mr-2 text-primer " />
          Assesment
        </h1>
      </div>
      <AssesmentTable />
    </MainLayout>
  );
}
