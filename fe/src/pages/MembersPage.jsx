import MainLayout from "@/components/layouts/MainLayout"
import DivisionTable from '@/components/sections/dashboard/DivisionTable';
import { divisionData} from '@/data/data';

export default function MembersPage() {
  return (
    <MainLayout>
       <DivisionTable data={divisionData} />
    </MainLayout>
  )
}
