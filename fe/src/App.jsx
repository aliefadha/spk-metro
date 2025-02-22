import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";
import DivisionPage from "./pages/DivisionPage";
import MembersPage from "./pages/MembersPage";
import KpiPage from "./pages/KpiPage";
import AssesmentPage from "./pages/AssesmentPage";
import KpiReportPage from "./pages/KpiReportPage";
import KpiReportPageIndividual from "./pages/KpiReportPageIndividual";
import SpkCalculationPage from "./pages/SpkCalculationPage";
import FinalResultPage from "./pages/FinalResultPage";
import AccessPage from "./pages/AccessPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/division" element={<DivisionPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/kpi" element={<KpiPage />} />
          <Route path="/assesment" element={<AssesmentPage />} />
          <Route path="/kpi-reports" element={<KpiReportPage />} />
          <Route path="/kpi-reports/project" element={<KpiReportPage />} />
          <Route
            path="/kpi-reports/individual"
            element={<KpiReportPageIndividual />}
          />
          <Route path="/spk-calculation" element={<SpkCalculationPage />} />
          <Route path="/final-result" element={<FinalResultPage />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}
