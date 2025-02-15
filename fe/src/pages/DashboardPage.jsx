import MainLayout from "@/components/layouts/MainLayout";
import WelcomeSection from "@/components/sections/dashboard/WelcomeSection";
import StatCard from "@/components/sections/dashboard/StatCard";
import KPITable from "@/components/sections/dashboard/KPITable";
import { dashboardStats } from "@/data/data";
import { LayoutGrid } from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1 className="flex items-center text-xl font-bold text-primer mb-3">
        <LayoutGrid className="w-5 h-5 mr-2 text-primer " />
        Dashboard
      </h1>
      <WelcomeSection userName="Daffa" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <KPITable />
    </MainLayout>
  );
}
