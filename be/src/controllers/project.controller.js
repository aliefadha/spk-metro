const prisma = require('../configs/database');
const validation = require('../validations/project.validation.js');
const constant = require('../utils/constant.js');

const projectController = {
    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const { month } = req.query;

            let whereClause = {};

            if (month) {
                // Parse the month (format: "2025-10")
                const [year, monthNum] = month.split('-');

                // Format dates as strings (YYYY-MM-DD format)
                const startDate = `${year}-${monthNum.padStart(2, '0')}-01`;
                const endDate = `${year}-${(parseInt(monthNum) + 1).toString().padStart(2, '0')}-01`;

                whereClause = {
                    tanggal_selesai: {
                        gte: startDate,
                        lt: endDate
                    }
                };
            }

            const projects = await prisma.project.findMany({
                where: whereClause,
                include: {
                    projectCollaborator: {
                        include: {
                            user: true,
                        }
                    },
                    asessment: true,
                },
                orderBy: {
                    deadline: 'desc'
                }
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

    createProject: async (req, res) => {
        try {
            const { projectName, bobot, deadline, status, projectCollaborator, tanggal_selesai } = req.body;

            console.log("REQ.BODY:", JSON.stringify(req.body, null, 2));

            const newProject = await prisma.project.create({
                data: {
                    projectName,
                    bobot,
                    deadline,
                    status,
                    tanggal_selesai,
                    projectCollaborator: {
                        create: projectCollaborator.map(collaborator => ({
                            userId: collaborator.userId,
                            isProjectManager: collaborator.isProjectManager,
                        })),
                    },
                },
            });

            console.log("NEW PROJECT:", JSON.stringify(newProject, null, 2));

            const projectWithCollaborators = await prisma.project.findUnique({
                where: { id: newProject.id },
                include: { projectCollaborator: { include: { user: true } } },
            });

            console.log("PROJECT WITH COLLABORATORS:", JSON.stringify(projectWithCollaborators, null, 2));

            const nonManagers = projectWithCollaborators.projectCollaborator.filter(collab => !collab.isProjectManager);

            console.log("NON-MANAGERS:", JSON.stringify(nonManagers, null, 2));

            const metrics = await prisma.metric.findMany();
            if (metrics.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "Tidak ada metric yang tersedia!",
                });
            }

            console.log("METRICS:", JSON.stringify(metrics, null, 2));
            const assessmentsData = nonManagers.flatMap(collaborator => {
                return metrics.map(metric => ({
                    projectId: newProject.id,
                    metricId: metric.id,
                    userId: collaborator.userId,
                    value: 0,
                    assesmentDate: new Date().toISOString().split("T")[0],
                }));
            });

            console.log("ASSESSMENTS DATA:", JSON.stringify(assessmentsData, null, 2));

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
            const { projectName, bobot, deadline, status, projectCollaborator, tanggal_selesai } = req.body;

            const updatedProject = await prisma.project.update({
                where: { id },
                data: {
                    projectName,
                    bobot,
                    deadline,
                    status,
                    tanggal_selesai,
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

            // Delete related assessments first
            const assessments = await prisma.assesment.findMany({
                where: { projectId: id },
            });

            for (const assessment of assessments) {
                await prisma.assesmentResult.deleteMany({
                    where: { assesmentId: assessment.id },
                });
                await prisma.metricNormalization.deleteMany({
                    where: { assesmentId: assessment.id },
                });
                await prisma.metricResult.deleteMany({
                    where: { assesmentId: assessment.id },
                });
            }

            await prisma.assesment.deleteMany({
                where: { projectId: id },
            });

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

    getDoneProjectsInMonth: async (req, res) => {
        try {
            const { month } = req.query;
            if (!month) {
                return res.status(400).json({
                    error: true,
                    message: 'Month parameter is required (format: + YYYY - MM)',
                });
            }

            // Parse the month (format: "2025-10")
            const [year, monthNum] = month.split('-');

            if (!year || !monthNum) {
                return res.status(400).json({
                    error: true,
                    message: 'Invalid month format. Use YYYY-MM format',
                });
            }

            // Format dates as strings (YYYY-MM-DD format)
            const startDate = `${year}-${monthNum.padStart(2,
                '0')}-01`;
            const endDate = `${year}-${(parseInt(monthNum) +
                1).toString().padStart(2, '0')}-01`;

            const projects = await prisma.project.findMany({
                where: {
                        status: 'DONE',
                    tanggal_selesai: {
                        gte: startDate,
                        lt: endDate
                    }
                },
                include: {
                    projectCollaborator: {
                        include: {
                            user: true,
                        }
                    },
                    asessment: true,
                },
                orderBy: {
                    deadline: 'desc'
                }
            });

            res.status(200).json({
                error: false,
                message: 'Done projects retrieved successfully',
                data: projects,
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error retrieving done projects',
                errorDetail: err.message,
            });
        }
    },

    getProjectCollaborators: async (req, res) => {
        try {
            const { projectId } = req.params; // Ambil projectId dari URL

            const collaborators = await prisma.projectCollaborator.findMany({
                where: { projectId, isProjectManager: false },
                include: { user: true }, // Ambil data user terkait
            });

            if (!collaborators.length) {
                return res.status(404).json({
                    error: true,
                    message: "Tidak ada anggota untuk project ini",
                });
            }

            // Format data agar hanya mengirim userId & fullName
            const result = collaborators.map((col) => ({
                userId: col.userId,
                fullName: col.user.fullName,
            }));

            res.status(200).json({
                error: false,
                message: "Data anggota proyek berhasil diambil",
                data: result,
            });
        } catch (error) {
            console.error("Gagal mengambil data anggota proyek:", error);
            res.status(500).json({
                error: true,
                message: "Gagal mengambil data anggota proyek",
                errorDetail: error.message,
            });
        }
    },



};

module.exports = projectController;
