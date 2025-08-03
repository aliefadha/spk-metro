const prisma = require('../configs/database');

const divisionController = {
  // Create a division
  createDivision: async (req, res) => {
    try {

      const { divisionName } = req.body;

      const existingDivision = await prisma.division.findUnique({
        where: { divisionName },
      });

      if (existingDivision) {
        return res.status(400).json({
          error: true,
          message: 'Division name already exists',
        });
      }

      const division = await prisma.division.create({
        data: {
          divisionName,
        },
      });

      res.status(201).json({
        error: false,
        message: 'Division created successfully',
        data: division,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Error creating division',
        errorDetail: err.message,
      });
    }
  },

  // Get all divisions
  getAllDivisions: async (req, res) => {
    try {
      const divisions = await prisma.division.findMany({
        include: {
          _count: {
            select: {
              user: true
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      });

      // Transform the data to include totalMember
      const divisionsWithTotalMember = divisions.map(division => ({
        ...division,
        totalMember: division._count.user
      }));

      res.status(200).json({
        error: false,
        message: 'Divisions retrieved successfully',
        data: divisionsWithTotalMember,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Error retrieving divisions',
        errorDetail: err.message,
      });
    }
  },

  // Get division by ID
  getDivisionById: async (req, res) => {
    try {
      const { id } = req.params;

      const division = await prisma.division.findUnique({
        where: { id },
      });

      if (!division) {
        return res.status(404).json({
          error: true,
          message: 'Division not found',
        });
      }

      res.status(200).json({
        error: false,
        message: 'Division retrieved successfully',
        data: division,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Error retrieving division',
        errorDetail: err.message,
      });
    }
  },

  // Update a division
  updateDivision: async (req, res) => {
    try {
      const { id } = req.params;
      const { divisionName } = req.body;

      const division = await prisma.division.findUnique({
        where: { id },
      });

      if (!division) {
        return res.status(404).json({
          error: true,
          message: 'Division not found',
        });
      }

      const updatedDivision = await prisma.division.update({
        where: { id },
        data: {
          divisionName: divisionName || division.divisionName,
        },
      });

      res.status(200).json({
        error: false,
        message: 'Division updated successfully',
        data: updatedDivision,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Error updating division',
        errorDetail: err.message,
      });
    }
  },

  // Delete a division
  deleteDivision: async (req, res) => {
    try {
      const { id } = req.params;

      const division = await prisma.division.findUnique({
        where: { id },
        include: {
          user: true,
          _count: {
            select: {
              user: true
            }
          }
        }
      });

      if (!division) {
        return res.status(404).json({
          error: true,
          message: 'Division not found',
        });
      }

      // Menggunakan transaction untuk memastikan cascade delete berjalan dengan aman
      await prisma.$transaction(async (prisma) => {
        // 1. Set divisionId users menjadi null (tidak menghapus user)
        await prisma.user.updateMany({
          where: { divisionId: id },
          data: { divisionId: null }
        });

        // 2. Ambil semua metric yang terkait dengan division
        const metrics = await prisma.metric.findMany({
          where: { divisionId: id },
          select: { id: true }
        });

        const metricIds = metrics.map(metric => metric.id);

        if (metricIds.length > 0) {
          // 3. Hapus semua assesmentResult yang terkait dengan assesment/assesmentNonDev dari metrics ini
          await prisma.assesmentResult.deleteMany({
            where: {
              OR: [
                {
                  assesment: {
                    metricId: { in: metricIds }
                  }
                },
                {
                  assesmentNonDev: {
                    metricId: { in: metricIds }
                  }
                }
              ]
            }
          });

          // 4. Hapus semua metricNormalization yang terkait dengan assesment/assesmentNonDev dari metrics ini
          await prisma.metricNormalization.deleteMany({
            where: {
              OR: [
                {
                  assesment: {
                    metricId: { in: metricIds }
                  }
                },
                {
                  assesmentNonDev: {
                    metricId: { in: metricIds }
                  }
                }
              ]
            }
          });

          // 5. Hapus semua metricResult yang terkait dengan assesment/assesmentNonDev dari metrics ini
          await prisma.metricResult.deleteMany({
            where: {
              OR: [
                {
                  assesment: {
                    metricId: { in: metricIds }
                  }
                },
                {
                  assesmentNonDev: {
                    metricId: { in: metricIds }
                  }
                }
              ]
            }
          });

          // 6. Hapus semua assesment yang terkait dengan metrics ini
          await prisma.assesment.deleteMany({
            where: { metricId: { in: metricIds } }
          });

          // 7. Hapus semua assesmentNonDev yang terkait dengan metrics ini
          await prisma.assesmentNonDev.deleteMany({
            where: { metricId: { in: metricIds } }
          });

          // 8. Hapus semua metric yang terkait dengan division
          await prisma.metric.deleteMany({
            where: { divisionId: id }
          });
        }

        // 9. Hapus division
        await prisma.division.delete({
          where: { id },
        });
      });

      res.status(200).json({
        error: false,
        message: `Division deleted successfully. ${division._count.user} users have been moved to no division.`,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Error deleting division',
        errorDetail: err.message,
      });
    }
  },
};

module.exports = divisionController;
