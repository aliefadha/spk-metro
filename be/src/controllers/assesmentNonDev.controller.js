const prisma = require('../configs/database');

const assesmentNonDevController = {
  // Create a new non-dev assessment
  createAssessment: async (req, res) => {
    const { userId, value, metricId, assessmentDate } = req.body;

    if (!userId || !Array.isArray(value) || value.length !== 5 || !metricId || !assessmentDate) {
      return res.status(400).json({
        error: true,
        message: "userId, metricId, assessmentDate harus diisi dan value harus berupa array dengan 5 angka.",
      });
    }

    try {
      const assessments = await Promise.all(
        value.map(async (val) => {
          return prisma.assesmentNonDev.create({
            data: {
              userId,
              value: val,
              metricId,
              assesmentDate: assessmentDate,
            },
          });
        })
      );

      res.status(201).json({
        error: false,
        message: "Assessment Non-Dev berhasil ditambahkan",
        data: assessments,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menambahkan assessment Non-Dev",
        errorDetail: error.message,
      });
    }
  },

  getAllAssessments: async (req, res) => {
    try {
        const assessments = await prisma.assesmentNonDev.findMany({
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
      const assessments = await prisma.assesmentNonDev.findMany({
        where: { userId },
      });

      res.status(200).json({
        error: false,
        message: "Data assessment Non-Dev berdasarkan userId berhasil diambil",
        data: assessments,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal mengambil data assessment Non-Dev",
        errorDetail: error.message,
      });
    }
  },

  // Update assessment for Non-Dev (no projectId involved)
  updateAssessment: async (req, res) => {
    try {
      const { userId, assessments } = req.body;

      if (!userId || !Array.isArray(assessments) || assessments.length === 0) {
        return res.status(400).json({
          error: true,
          message: "UserId dan assessments (array) harus disertakan",
        });
      }

      // Non-Dev: No projectId used here!
      const updatePromises = assessments.map(async ({ metricId, value, assesmentDate }) => {
        const whereClause = { userId, metricId };
        // Check if the row exists
        const existing = await prisma.assesmentNonDev.findFirst({ where: whereClause });
        if (existing) {
          const result = await prisma.assesmentNonDev.updateMany({
            where: whereClause,
            data: { value: parseInt(value, 10), assesmentDate },
          });
          console.log(`Updated metricId ${metricId} for userId ${userId}:`, result);
          return result;
        } else {
          const result = await prisma.assesmentNonDev.create({
            data: {
              userId,
              metricId,
              value: parseInt(value, 10),
              assesmentDate,
            },
          });
          console.log(`Created new assessment for metricId ${metricId} for userId ${userId}`);
          return result;
        }
      });

      await Promise.all(updatePromises);

      res.status(200).json({
        error: false,
        message: "Assessment Non-Dev berhasil diperbarui",
      });
    } catch (error) {
      console.error("Update Error (Non-Dev):", error);
      res.status(500).json({
        error: true,
        message: "Gagal memperbarui assessment Non-Dev",
        errorDetail: error.message,
      });
    }
  },

  // Delete an assessment
  deleteAssessment: async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.assesmentNonDev.delete({ where: { id } });

      res.status(200).json({
        error: false,
        message: "Assessment Non-Dev berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Gagal menghapus assessment Non-Dev",
        errorDetail: error.message,
      });
    }
  },

  getAssessmentTableByDivision: async (req, res) => {
    try {
      const divisionName = req.params.division;
      const { month } = req.query;
      
      // Get all users in the division using proper relation
      const users = await prisma.user.findMany({
        where: { 
          division: { 
            divisionName: divisionName 
          } 
        },
        include: {
          division: true
        }
      });

      // Get all metrics
      const metrics = await prisma.metric.findMany();

      // Get all non-dev assessments for these users
      const userIds = users.map(u => u.id);
      
      let assessmentQuery = {
        where: { userId: { in: userIds } },
      };

      // Add month filtering if provided
      if (month) {
        // Parse the month (format: "2025-10")
        const [year, monthNum] = month.split('-');
        
        if (year && monthNum) {
          // Format dates as proper DateTime strings (ISO format)
          const startDate = new Date(`${year}-${monthNum.padStart(2, '0')}-01T00:00:00.000Z`);
          const endDate = new Date(`${year}-${(parseInt(monthNum) + 1).toString().padStart(2, '0')}-01T00:00:00.000Z`);
          
          assessmentQuery.where.created_at = {
            gte: startDate,
            lt: endDate
          };
        }
      }

      const assessments = await prisma.assesmentNonDev.findMany(assessmentQuery);

      // Format response - always return users with default 0 values if no assessments
      const result = users.map((user) => {
        const metricValues = metrics.map((metric) => {
          const assessment = assessments.find(
            (a) => a.userId === user.id && a.metricId === metric.id
          );
          return {
            metricId: metric.id,
            value: assessment ? assessment.value : 0
          };
        });

        // Find the first assessment for this user to get the date
        const userAssessment = assessments.find(a => a.userId === user.id);

        return {
          userId: user.id,
          fullName: user.fullName,
          assesmentDate: userAssessment ? userAssessment.assesmentDate : null,
          created_at: userAssessment ? userAssessment.created_at : null,
          metrics: metricValues,
        };
      });

      res.status(200).json({
        error: false,
        message: "Data assessment non-dev berhasil diambil",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAssessmentTableByDivision:", error);
      res.status(500).json({
        error: true,
        message: "Gagal mengambil data assessment non-dev",
        errorDetail: error.message,
      });
    }
  },
};

module.exports = assesmentNonDevController; 