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

  // Get all assessments
  getAllAssessments: async (req, res) => {
    try {
      const assessments = await prisma.assesment.findMany();
      res.status(200).json({
        error: false,
        message: "Data assessment berhasil diambil",
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
        const { id } = req.params;
        const { value } = req.body;

        // Validasi input
        if (!value || !Array.isArray(value)) {
            return res.status(400).json({
                error: true,
                message: "Value harus berupa array angka",
            });
        }

        // Update assessment di database
        const updatedAssessment = await prisma.assesment.update({
            where: { id },
            data: { value },
        });

        res.status(200).json({
            error: false,
            message: "Assessment berhasil diperbarui",
            data: updatedAssessment,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Gagal memperbarui assessment",
            errorDetail: err.message,
        });
    }
},



  getAssessmentTable: async (req, res) => {
    try {
      const projectId = req.params.projectId; 
  
      const projectMembers = await prisma.projectCollaborator.findMany({
        where: { projectId },
        include: {
          user: true, 
        },
      });
  
      const metrics = await prisma.metric.findMany();
  
      const assessments = await prisma.assesment.findMany({
        where: { projectId },
        include: {
          metric: true, 
        },
      });
  
      const result = projectMembers.map((member) => {
        const userId = member.userId;
        const userFullName = member.user.fullName; 
  
        const metricValues = metrics.map((metric) => {
          const assessment = assessments.find(
            (a) => a.userId === userId && a.metricId === metric.id
          );
          return assessment ? assessment.value : 0; 
        });
  
        return {
          userId,
          fullName: userFullName,
          metrics: metricValues,
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
