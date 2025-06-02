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
import PrivateRoute from "./pages/PrivateRoute";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <ProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/division"
            element={
              <PrivateRoute>
                <DivisionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <MembersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/kpi"
            element={
              <PrivateRoute>
                <KpiPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assesment"
            element={
              <PrivateRoute>
                <AssesmentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/kpi-reports"
            element={
              <PrivateRoute>
                <KpiReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/kpi-reports/project"
            element={
              <PrivateRoute>
                <KpiReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/kpi-reports/individual"
            element={
              <PrivateRoute>
                <KpiReportPageIndividual />
              </PrivateRoute>
            }
          />
          <Route
            path="/spk-calculation"
            element={
              <PrivateRoute>
                <SpkCalculationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/final-result"
            element={
              <PrivateRoute>
                <FinalResultPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/access"
            element={
              <PrivateRoute>
                <AccessPage />
              </PrivateRoute>
            }
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}
