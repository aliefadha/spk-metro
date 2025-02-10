import MainLayout from "@/components/layouts/MainLayout"
import DivisionTable from '@/components/sections/dashboard/DivisionTable';
import { divisionData} from '@/data/data';
import { Key } from 'lucide-react';


export default function AccessPage() {
  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
      <h1 className="flex items-center text-xl font-bold text-primer mb-3 mr-5"> <Key className="w-5 h-5 mr-2 text-primer "/> Access</h1>
      </div>
      <DivisionTable data={divisionData} />
    </MainLayout>
  )
}
