const express = require("express");
const publicRoute = express.Router();
const userController = require("../controllers/user.controller.js");
const divisionController = require("../controllers/division.controller.js");
const projectController = require("../controllers/project.controller.js");
const memberController = require("../controllers/member.controller.js");

publicRoute.post("/api/v1/login", userController.login);

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

module.exports = publicRoute;
