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
      const divisions = await prisma.division.findMany();

      res.status(200).json({
        error: false,
        message: 'Divisions retrieved successfully',
        data: divisions,
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
      const { divisionName, totalMember } = req.body;

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
          totalMember: totalMember !== undefined ? totalMember : division.totalMember,
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
      });

      if (!division) {
        return res.status(404).json({
          error: true,
          message: 'Division not found',
        });
      }

      await prisma.division.delete({
        where: { id },
      });

      res.status(200).json({
        error: false,
        message: 'Division deleted successfully',
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
