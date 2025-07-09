const prisma = require('../configs/database');

const assessmentController = {
  // Create a new assessment
  createAssessment: async (req, res) => {
    const { userId, value, projectId, metricId, assessmentDate } = req.body;

    if (!userId || !Array.isArray(value) || value.length !== 5 || !projectId || !metricId || !assessmentDate) {
      return res.status(400).json({
        error: true,
        message: "userId, projectId, metricId, assessmentDate harus diisi dan value harus berupa array dengan 5 angka.",
      });
    }

    try {
      const assessments = await Promise.all(
        value.map(async (val) => {
          return prisma.assesment.create({
            data: {
              userId,
              value: val,
              projectId,
              metricId,
              assesmentDate: assessmentDate,
            },
          });
        })
      );

      res.status(201).json({
        error: false,
        message: "Assessment berhasil ditambahkan",
        data: assessments,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menambahkan assessment",
        errorDetail: error.message,
      });
    }
  },

  getAllAssessments: async (req, res) => {
    try {
        const assessments = await prisma.assesment.findMany({
            include: {
                user: { select: { fullName: true } },  
                metric: { select: { id: true, name: true } },  
            },
        });

        const groupedAssessments = assessments.reduce((acc, item) => {
            let userIndex = acc.findIndex(u => u.userId === item.userId);
            if (userIndex === -1) {
                acc.push({
                    userId: item.userId,
                    fullName: item.user.fullName,
                    metrics: {
                        [item.metric.name]: item.value  
                    }
                });
            } else {
                acc[userIndex].metrics[item.metric.name] = item.value;
            }
            return acc;
        }, []);

        res.status(200).json({
            error: false,
            message: "Data assessment berhasil diambil",
            data: groupedAssessments,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Gagal mengambil data assessment",
            errorDetail: error.message,
        });
    }
},


  // Get assessment by userId
  getAssessmentsByUser: async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: true,
        message: "userId harus disertakan.",
      });
    }

    try {
      const assessments = await prisma.assesment.findMany({
        where: { userId },
      });

      res.status(200).json({
        error: false,
        message: "Data assessment berdasarkan userId berhasil diambil",
        data: assessments,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal mengambil data assessment",
        errorDetail: error.message,
      });
    }
  },

  updateAssessment: async (req, res) => {
    try {
        const { userId, assessments, projectId } = req.body;

        console.log("Incoming Update Request:", req.body);

        if (!userId || !Array.isArray(assessments) || assessments.length === 0) {
            return res.status(400).json({
                error: true,
                message: "UserId dan assessments (array) harus disertakan",
            });
        }

        // Cek apakah assessment ada sebelum update
        const existingAssessments = await prisma.assesment.findMany({
            where: projectId ? { userId, projectId } : { userId }
        });
        console.log("Existing Assessments:", existingAssessments);

        // Update setiap assessment berdasarkan userId + metricId
        const updatePromises = assessments.map(async ({ metricId, value, assesmentDate }) => {
            const whereClause = projectId ? { userId, metricId, projectId } : { userId, metricId };
            // Check if the row exists
            const existing = await prisma.assesment.findFirst({ where: whereClause });
            if (existing) {
                const result = await prisma.assesment.updateMany({
                    where: whereClause,
                    data: { value: parseInt(value, 10), assesmentDate },
                });
                console.log(`Updating metricId ${metricId} with value ${value} for projectId ${projectId}:`, result);
                return result;
            } else {
                // Create new assessment if not exists
                const result = await prisma.assesment.create({
                    data: {
                        userId,
                        metricId,
                        projectId,
                        value: parseInt(value, 10),
                        assesmentDate,
                    },
                });
                console.log(`Created new assessment for metricId ${metricId} for projectId ${projectId}`);
                return result;
            }
        });

        await Promise.all(updatePromises);

        res.status(200).json({
            error: false,
            message: "Assessment berhasil diperbarui",
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            error: true,
            message: "Gagal memperbarui assessment",
            errorDetail: error.message,
        });
    }
},




getAssessmentTable: async (req, res) => {
  try {
      const projectId = req.params.projectId;

      // Ambil semua member yang bukan PM dari proyek
      const projectMembers = await prisma.projectCollaborator.findMany({
          where: { 
              projectId,
              isProjectManager: false 
          },
          include: {
              user: true,
          },
      });

      // Ambil semua KPI (metrics)
      const metrics = await prisma.metric.findMany();

      // Ambil semua assessment untuk proyek ini
      const assessments = await prisma.assesment.findMany({
          where: { projectId },
      });

      // Format response dengan metricId & value
      const result = projectMembers.map((member) => {
          const userId = member.userId;
          const userFullName = member.user.fullName;

          const metricValues = metrics.map((metric) => {
              const assessment = assessments.find(
                  (a) => a.userId === userId && a.metricId === metric.id
              );
              return {
                  metricId: metric.id,
                  value: assessment ? assessment.value : 0
              };
          });

          // Find the first assessment for this user to get the date
          const userAssessment = assessments.find(a => a.userId === userId);

          return {
              userId,
              fullName: userFullName,
              assesmentDate: userAssessment ? userAssessment.assesmentDate : null,
              metrics: metricValues, // Sekarang sudah ada metricId!
          };
      });

      res.status(200).json({
          error: false,
          message: "Data assessment berhasil diambil",
          data: result,
      });
  } catch (error) {
      res.status(500).json({
          error: true,
          message: "Gagal mengambil data assessment",
          errorDetail: error.message,
      });
  }
},

  

  // Delete an assessment
  deleteAssessment: async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.assesment.delete({ where: { id } });

      res.status(200).json({
        error: false,
        message: "Assessment berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menghapus assessment",
        errorDetail: error.message,
      });
    }
  },
};



module.exports = assessmentController;
