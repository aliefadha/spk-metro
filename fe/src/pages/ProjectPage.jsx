import MainLayout from "@/components/layouts/MainLayout";
import ProjectTable from "@/components/sections/dashboard/ProjectTable";
import api from "@/utils/axios";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

export default function ProjectPage() {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    api.get("/v1/division").then((res) => {
      if (!res.data.error) setDivisions(res.data.data);
    });
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          {" "}
          <Briefcase className="w-5 h-5 mr-2 text-primer " /> Project
        </h1>
        <select
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
          value={selectedDivision}
          onChange={e => setSelectedDivision(e.target.value)}
        >
          <option value="">Filter berdasarkan divisi</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.divisionName}
            </option>
          ))}
        </select>
        <input
          type="month"
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
        />
        <button className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer ml-auto">
          Export
        </button>
      </div>
      <ProjectTable 
        divisionId={selectedDivision} 
        divisionName={
          selectedDivision
            ? (divisions.find((d) => d.id === selectedDivision)?.divisionName || "")
            : ""
        }
      />
    </MainLayout>
  );
}
