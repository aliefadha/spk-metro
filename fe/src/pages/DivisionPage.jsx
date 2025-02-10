import MainLayout from "@/components/layouts/MainLayout"
import DivisionTable from '@/components/sections/dashboard/DivisionTable';
import { divisionData} from '@/data/data';
import { Pentagon } from 'lucide-react';


export default function DivisionPage() {
  return (
    <MainLayout>
      <h1 className="flex items-center text-xl font-bold text-primer mb-3">
        <Pentagon className="w-5 h-5 mr-2 text-primer "/>
        Division
      </h1>
        <DivisionTable data={divisionData} />
    </MainLayout>
  )
}
