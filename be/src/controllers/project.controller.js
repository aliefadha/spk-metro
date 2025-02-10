const prisma = require('../configs/database');
const validation = require('../validations/project.validation.js')
const constant = require('../utils/constant.js')

const projectController = {
    getAllDivisions: async (req, res) => {
        try {
            const divisions = await prisma.division.findMany({
                select: {
                    id: true,
                    divisionName: true,
                    totalMember: true,
                },
            });

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
}

module.exports = projectController