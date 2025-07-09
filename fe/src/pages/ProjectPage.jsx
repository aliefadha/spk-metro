import MainLayout from "@/components/layouts/MainLayout";
import ProjectTable from "@/components/sections/dashboard/ProjectTable";
import { Briefcase } from "lucide-react";
import { useState } from "react";

export default function ProjectPage() {
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          {" "}
          <Briefcase className="w-5 h-5 mr-2 text-primer " /> Project
        </h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
        />
        <button className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto">
          Export
        </button>
      </div>
      <ProjectTable selectedMonth={selectedMonth} />
    </MainLayout>
  );
}
