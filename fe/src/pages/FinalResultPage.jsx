import MainLayout from "@/components/layouts/MainLayout";
import FinalTabel from "@/components/sections/dashboard/FinalTabel";
import { Award } from "lucide-react";

export default function FinalResultPage() {
  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          {" "}
          <Award className="w-5 h-5 mr-2 text-primer " /> Final Result
        </h1>
        <button className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto">
          Export
        </button>
      </div>
      <FinalTabel />
    </MainLayout>
  );
}
