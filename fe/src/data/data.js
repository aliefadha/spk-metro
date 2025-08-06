import {
  LayoutGrid,
  Briefcase,
  Pentagon,
  Users,
  Target,
  FileText,
  Calculator,
  Award,
  Key, 
  ListTodo,
  LogOut,
} from 'lucide-react';


export const sidebarLinks = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: Pentagon, label: 'Division', path: '/division' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: Target, label: 'KPI', path: '/kpi' },
  { icon: Briefcase, label: 'Project', path: '/project' },
  { icon: FileText, label: 'Assesment', path: '/assesment' },
  {
    icon: Calculator,
    label: 'KPI Reports',
    path: '/kpi-reports',
    subItems: [
      { label: 'Project', path: '/kpi-reports/project' },
      { label: 'Individual', path: '/kpi-reports/individual' }
    ]
  },
  { icon: Calculator, label: 'SPK Calculation', path: '/spk-calculation' },
  { icon: Award, label: 'Final Result', path: '/final-result' },
  { icon: Key, label: 'Access', path: '/access' },
  { icon: LogOut, label: 'Keluar', path: '/logout' }
];

export const sidebarLinksUser = [
  { icon: FileText, label: 'Assesment', path: '/userassesment', showWhenProjects: true },
  {
    icon: Calculator,
    label: 'KPI Reports',
    path: '/userkpiproject',
    subItems: [
      { label: 'Project', path: '/userkpiproject' },
      { label: 'Individual', path: '/userkpiindividual' }
    ]
  },
  { icon: Calculator, label: 'SPK Calculation', path: '/userspk' },
  { icon: Award, label: 'Final Result', path: '/userfinal' },
  { icon: LogOut, label: 'Keluar', path: '/logout' }
];

export const dashboardStats = [
  { 
    title: 'Anggota', 
    value: 12, 
    Icon: Users,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500'
  },
  { 
    title: 'Divisi', 
    value: 2, 
    Icon: ListTodo,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500'
  },
  { 
    title: 'Proyek', 
    value: 14, 
    Icon: Briefcase,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  }
];

export const kpiData = [
  { id: 1, name: 'Reza', metrics: [60, 70, 80, 90, 90], score: 90, status: 'Achieved' },
  { id: 2, name: 'Rezi', metrics: [60, 70, 80, 90, 90], score: 90, status: 'Not Achieved' },
  { id: 3, name: 'Rozo', metrics: [60, 70, 80, 90, 90], score: 90, status: 'Achieved' },
  { id: 4, name: 'Raze', metrics: [60, 70, 80, 90, 90], score: 90, status: 'Achieved' }
];


export const projectData = [
  { id: 1, nama_proyek: 'E-Commerce Resong',        bobot:'1,2 (Medium)', deadline :'12/12/2025',  pm : 'Daffa',  anggota :'Daffa, Kemal', status: 'Done' },
  { id: 2, nama_proyek: 'Sistem Informasi Apotek',  bobot:'1,2 (Medium)', deadline :'12/12/2025', pm : 'Syifa',   anggota :'Daffa, Kemal', status: 'On Progress' },
  { id: 3, nama_proyek: 'Sistem Informasi Apotek',  bobot:'1,2 (Medium)', deadline :'12/12/2025', pm : 'Hagi',    anggota :'Daffa, Kemal', status: 'On Progress' },
  { id: 4, nama_proyek: 'Sistem Informasi Apotek',  bobot:'1,2 (Medium)', deadline :'12/12/2025', pm : 'Eland',   anggota :'Daffa, Kemal', status: 'On Progress' }
];

export const divisionData = [
  { id: 1, nama_divisi: 'Developer',  jumlah_anggota :'12' },
  { id: 2, nama_divisi: 'Marketing',  jumlah_anggota :'15' },

];