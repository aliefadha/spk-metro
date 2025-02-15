const express = require("express");
const publicRoute = express.Router();
const userController = require("../controllers/user.controller.js");
const divisionController = require("../controllers/division.controller.js");
const projectController = require("../controllers/project.controller.js");
const memberController = require("../controllers/member.controller.js");
const kpiController = require ("../controllers/kpi.controller.js")
const assessmentController = require ("../controllers/assesment.controller.js")
const dashboardController = require ("../controllers/dashboard.controller.js")

publicRoute.post("/api/v1/login", userController.login);

//Dashboard 
publicRoute.get("/api/v1/count", dashboardController.countData)

// Routes Division
publicRoute.post("/api/v1/division", divisionController.createDivision);
publicRoute.get("/api/v1/division", divisionController.getAllDivisions);
publicRoute.get("/api/v1/division/:id", divisionController.getDivisionById);
publicRoute.put("/api/v1/division/:id", divisionController.updateDivision);
publicRoute.delete("/api/v1/division/:id", divisionController.deleteDivision);

//project
publicRoute.get("/api/v1/projects", projectController.getAllProjects);
publicRoute.get("/api/v1/project/:id", projectController.getProjectById);
publicRoute.post("/api/v1/project", projectController.createProject);
publicRoute.patch("/api/v1/project/:id", projectController.updateProject);
publicRoute.delete("/api/v1/project/:id", projectController.deleteProject);

//member
publicRoute.post("/api/v1/member", memberController.createMember);
publicRoute.get("/api/v1/member", memberController.getAllMembers);
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
publicRoute.put("/api/v1/assessments/:id", assessmentController.updateAssessment);
publicRoute.delete("/api/v1/assessments/:id", assessmentController.deleteAssessment);


module.exports = publicRoute;
