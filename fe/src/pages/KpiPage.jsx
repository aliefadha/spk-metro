import MainLayout from "@/components/layouts/MainLayout";
import TableKPI from "@/components/sections/dashboard/TableKPI";
import { Target } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function KpiPage() {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await api.get("/v1/division");
        if (!response.data.error) {
          setDivisions(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5">
          <Target className="w-5 h-5 mr-2 text-primer " />
          KPI
        </h1>
        <select 
          className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <option value="">Filter berdasarkan divisi</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.divisionName}
            </option>
          ))}
        </select>
      </div>
      <TableKPI 
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
