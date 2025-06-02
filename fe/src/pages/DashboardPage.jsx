import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import WelcomeSection from "@/components/sections/dashboard/WelcomeSection";
import StatCard from "@/components/sections/dashboard/StatCard";
import { LayoutGrid, Users, ListTodo, Briefcase } from "lucide-react";
import KPIReportTableIndividual from "@/components/sections/dashboard/KPIReportTableIndividual";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    divisionCount: 0,
    projectCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/count");
        const json = await response.json();
        if (!json.error) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Gagal ambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardStats = [
    {
      title: "Anggota",
      value: stats.userCount,
      Icon: Users,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Divisi",
      value: stats.divisionCount,
      Icon: ListTodo,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-500",
    },
    {
      title: "Proyek",
      value: stats.projectCount,
      Icon: Briefcase,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <MainLayout>
      <h1 className="flex items-center text-xl font-bold text-primer mb-3">
        <LayoutGrid className="w-5 h-5 mr-2 text-primer" />
        Dashboard
      </h1>

      <WelcomeSection userName="Daffa (Manajer Operasional Metro Software)" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading statistik...</p>
        ) : (
          dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </div>
      <KPIReportTableIndividual />
    </MainLayout>
  );
}
