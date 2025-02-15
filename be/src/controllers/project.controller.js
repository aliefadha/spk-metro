const prisma = require('../configs/database');
const validation = require('../validations/project.validation.js');
const constant = require('../utils/constant.js');

const projectController = {
    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    projectCollaborator: {
                        include : {
                            user : true,
                        }
                    },
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
    
            console.log("Data projectCollaborator dari request:", projectCollaborator);
    
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
                include: {
                    projectCollaborator: {
                        select: {
                            userId: true,
                            isProjectManager: true, 
                        },
                    },
                },
            });
    
            console.log("Data projectCollaborator setelah create:", JSON.stringify(newProject.projectCollaborator, null, 2));
    
            const metrics = await prisma.metric.findMany();
            if (metrics.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "Tidak ada metric yang tersedia!",
                });
            }
    
            const filteredCollaborators = newProject.projectCollaborator.reduce((acc, collab) => {
                if (!collab.isProjectManager) {
                    acc.push(collab);
                }
                return acc;
            }, []);
            
            console.log("Filtered Collaborators (Hanya isProjectManager: false):", JSON.stringify(filteredCollaborators, null, 2));
            
    
            const assessmentsData = filteredCollaborators.map(collaborator => {
                return metrics.map(metric => ({
                    projectId: newProject.id,
                    metricId: metric.id,
                    userId: collaborator.userId,
                    value: 0, 
                    assesmentDate: new Date().toISOString().split("T")[0], 
                }));
            }).flat();  
            
    
            console.log("Data assessmentsData sebelum insert:", JSON.stringify(assessmentsData, null, 2));
    
            if (assessmentsData.length > 0) {
                await prisma.assesment.createMany({
                    data: assessmentsData,
                    skipDuplicates: true, 
                });
            }
    
            res.status(201).json({
                error: false,
                message: "Project dan assessment berhasil dibuat",
                data: newProject,
            });
    
        } catch (err) {
            console.error("Error creating project:", err);
            res.status(500).json({
                error: true,
                message: "Error creating project",
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
    
            const project = await prisma.project.findUnique({
                where: { id },
            });
    
            if (!project) {
                return res.status(404).json({
                    error: true,
                    message: 'Project not found',
                });
            }
    
            await prisma.projectCollaborator.deleteMany({
                where: { projectId: id },
            });
    
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
