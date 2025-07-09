import MainLayout from "@/components/layouts/MainLayout";
import AssesmentTable from "@/components/sections/dashboard/AssesmentTable";
import api from "@/utils/axios";
import { useState, useEffect } from "react";
import { FileText, Calendar } from "lucide-react";

export default function AssesmentPage() {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    api.get("/v1/division").then((res) => {
      if (!res.data.error) setDivisions(res.data.data);
    });
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 ">
        <h1 className="flex items-center text-xl font-bold text-primer mr-5">
          <FileText className="w-5 h-5 mr-2 text-primer " />
          Assesment
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
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primer" />
          <input
            type="month"
            className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            placeholder="Filter berdasarkan bulan"
          />
        </div>
      </div>
      <AssesmentTable 
        selectedDivision={selectedDivision} 
        divisionName={
          selectedDivision
            ? (divisions.find((d) => d.id === selectedDivision)?.divisionName || "")
            : ""
        }
        selectedMonth={selectedMonth}
      />
    </MainLayout>
  );
}
