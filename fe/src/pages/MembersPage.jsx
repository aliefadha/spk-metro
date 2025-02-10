import MainLayout from "@/components/layouts/MainLayout"
import MemberTable from '@/components/sections/dashboard/MemberTable';
import { divisionData} from '@/data/data';
import { Users } from 'lucide-react';

export default function MembersPage() {
  return (
    <MainLayout>
      <h1 className="flex items-center text-xl font-bold text-primer mb-3">
        <Users className="w-5 h-5 mr-2 text-primer "/>
        Members
      </h1>
       <MemberTable data={divisionData} />
    </MainLayout>
  )
}
