import MainLayout from "@/components/layouts/MainLayout"
import TableKPI from '@/components/sections/dashboard/TableKPI';
import { divisionData} from '@/data/data';
import { Target } from 'lucide-react';


export default function KpiPage() {
  return (
    <MainLayout>
        <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
          <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5"><Target className="w-5 h-5 mr-2 text-primer "/>KPI</h1>
          <select className="px-4 py-2 border border-primer rounded-lg bg-transparent text-primer py-1">
                <option value="001"> Filter berdasarkan divisi </option>
          </select>
        </div>
      <TableKPI data={divisionData} />
    </MainLayout>
  )
}
