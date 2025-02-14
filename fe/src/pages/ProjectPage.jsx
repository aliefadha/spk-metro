import MainLayout from "@/components/layouts/MainLayout";
import ProjectTable from "@/components/sections/dashboard/ProjectTable";
import { projectData } from "@/data/data";
import { Briefcase } from "lucide-react";

export default function ProjectPage() {
  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          {" "}
          <Briefcase className="w-5 h-5 mr-2 text-primer " /> Project
        </h1>
        <select className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer py-1">
          <option value="001"> Filter berdasarkan divisi </option>
        </select>
        <input
          type="month"
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
        />
        <button className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto">
          Export
        </button>
      </div>
      <ProjectTable />
    </MainLayout>
  );
}
