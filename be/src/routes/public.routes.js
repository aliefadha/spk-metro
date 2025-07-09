const express = require("express");
const publicRoute = express.Router();
const userController = require("../controllers/user.controller.js");
const divisionController = require("../controllers/division.controller.js");
const projectController = require("../controllers/project.controller.js");
const memberController = require("../controllers/member.controller.js");
const kpiController = require("../controllers/kpi.controller.js")
const assessmentController = require("../controllers/assesment.controller.js")
const dashboardController = require("../controllers/dashboard.controller.js")
const metricController = require("../controllers/metric.controller.js")
const spkController = require("../controllers/spk.controller.js")
const assesmentNonDevController = require("../controllers/assesmentNonDev.controller.js")

publicRoute.post("/api/v1/login", userController.login);

//Dashboard 
publicRoute.get("/api/v1/count", dashboardController.countData)
publicRoute.get("/api/v1/user", dashboardController.getUserData)

// Routes Division
publicRoute.post("/api/v1/division", divisionController.createDivision);
publicRoute.get("/api/v1/division", divisionController.getAllDivisions);
publicRoute.get("/api/v1/division/:id", divisionController.getDivisionById);
publicRoute.put("/api/v1/division/:id", divisionController.updateDivision);
publicRoute.delete("/api/v1/division/:id", divisionController.deleteDivision);

//project
publicRoute.get("/api/v1/projects", projectController.getAllProjects);
publicRoute.get("/api/v1/projects/done", projectController.getDoneProjectsInMonth);
publicRoute.get("/api/v1/project/:id", projectController.getProjectById);
publicRoute.post("/api/v1/project", projectController.createProject);
publicRoute.put("/api/v1/project/:id", projectController.updateProject);
publicRoute.delete("/api/v1/project/:id", projectController.deleteProject);
publicRoute.get("/api/v1/project/project-collaborators/:projectId", projectController.getProjectCollaborators);


//member
publicRoute.post("/api/v1/member", memberController.createMember);
publicRoute.get("/api/v1/member", memberController.getAllMembers);
publicRoute.put("/api/v1/member/:id", memberController.updateMember);
publicRoute.delete("/api/v1/member/:id", memberController.deleteMember);

//metric/kpi
publicRoute.post("/api/v1/metrics", kpiController.createKpi);
publicRoute.get("/api/v1/metrics", kpiController.getAllKpis);
publicRoute.get("/api/v1/metrics/division", kpiController.getKpisByDivision);
publicRoute.put("/api/v1/metrics/:id", kpiController.editKpi);
publicRoute.delete("/api/v1/metrics/:id", kpiController.deleteKpi);

//assesment
publicRoute.post("/api/v1/assessments", assessmentController.createAssessment);
publicRoute.get("/api/v1/assessments", assessmentController.getAssessmentTable);
publicRoute.get("/api/v1/assessments/user", assessmentController.getAssessmentsByUser);
publicRoute.put("/api/v1/assessments", assessmentController.updateAssessment);
publicRoute.delete("/api/v1/assessments/:id", assessmentController.deleteAssessment);
publicRoute.get("/api/v1/assessments/project/:projectId", assessmentController.getAssessmentTable);

// assesmentNonDev
publicRoute.post("/api/v1/assessments-nondev", assesmentNonDevController.createAssessment);
publicRoute.get("/api/v1/assessments-nondev", assesmentNonDevController.getAllAssessments);
publicRoute.get("/api/v1/assessments-nondev/user", assesmentNonDevController.getAssessmentsByUser);
publicRoute.put("/api/v1/assessments-nondev", assesmentNonDevController.updateAssessment);
publicRoute.delete("/api/v1/assessments-nondev/:id", assesmentNonDevController.deleteAssessment);
publicRoute.get("/api/v1/assessments-nondev/division/:division", assesmentNonDevController.getAssessmentTableByDivision);

//metric
publicRoute.post("/api/v1/kpi-reports", metricController.getKPIReportByUser);
publicRoute.get("/api/v1/kpi-reports", metricController.getAllKPIReports);

//spk 
publicRoute.get('/api/decision-matrix', spkController.getDecisionMatrix);
publicRoute.get('/api/normalized-matrix', spkController.getNormalizedMatrix);
publicRoute.get('/api/si-ri', spkController.getSiRi);
publicRoute.get('/api/vikor-result', spkController.getVikorResultByProject);



module.exports = publicRoute;
