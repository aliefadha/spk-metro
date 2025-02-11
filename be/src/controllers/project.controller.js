const prisma = require('../configs/database');
const validation = require('../validations/project.validation.js');
const constant = require('../utils/constant.js');

const projectController = {
    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    projectCollaborator: true,
                    asessment: true,
                },
            });

            res.status(200).json({
                error: false,
                message: 'Projects retrieved successfully',
                data: projects,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error retrieving projects',
                errorDetail: err.message,
            });
        }
    },

    // Get project by ID
    getProjectById: async (req, res) => {
        try {
            const { id } = req.params;
            const project = await prisma.project.findUnique({
                where: { id },
                include: {
                    projectCollaborator: true,
                    asessment: true,
                },
            });

            if (!project) {
                return res.status(404).json({
                    error: true,
                    message: 'Project not found',
                });
            }

            res.status(200).json({
                error: false,
                message: 'Project retrieved successfully',
                data: project,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error retrieving project',
                errorDetail: err.message,
            });
        }
    },

    // Create a new project
    createProject: async (req, res) => {
        try {
            const { projectName, bobot, deadline, status, projectCollaborator } = req.body;
            const newProject = await prisma.project.create({
                data: {
                    projectName,
                    bobot,
                    deadline,
                    status,
                    projectCollaborator: {
                        create: projectCollaborator,
                    },
                },
            });

            res.status(201).json({
                error: false,
                message: 'Project created successfully',
                data: newProject,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error creating project',
                errorDetail: err.message,
            });
        }
    },

    // Update a project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { projectName, bobot, deadline, status, projectCollaborator } = req.body;

            const updatedProject = await prisma.project.update({
                where: { id },
                data: {
                    projectName,
                    bobot,
                    deadline,
                    status,
                    projectCollaborator: {
                        deleteMany: {},
                        create: projectCollaborator,
                    },
                },
            });

            res.status(200).json({
                error: false,
                message: 'Project updated successfully',
                data: updatedProject,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error updating project',
                errorDetail: err.message,
            });
        }
    },

    // Delete a project
    deleteProject: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.project.delete({
                where: { id },
            });

            res.status(200).json({
                error: false,
                message: 'Project deleted successfully',
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error deleting project',
                errorDetail: err.message,
            });
        }
    },
};

module.exports = projectController;
