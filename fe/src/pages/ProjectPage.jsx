import MainLayout from "@/components/layouts/MainLayout";
import ProjectTable from '@/components/sections/dashboard/ProjectTable';
import { projectData } from '@/data/data';



export default function ProjectPage() {
  return (
    <MainLayout>
        <ProjectTable data={projectData} />
    </MainLayout>
  )
}
