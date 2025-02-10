import MainLayout from "@/components/layouts/MainLayout"
import WelcomeSection from '@/components/sections/dashboard/WelcomeSection';
import StatCard from '@/components/sections/dashboard/StatCard';
import KPITable from '@/components/sections/dashboard/KPITable';
import { dashboardStats, kpiData } from '@/data/data';

export default function DashboardPage() {
  return (
    <MainLayout>
      <WelcomeSection userName="Daffa" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <KPITable data={kpiData} />
    </MainLayout>
  )
}
