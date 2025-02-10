const prisma = require('../configs/database');

const dashboardController = {
    countData: async (req, res) => {
        try {
            const userCount = await prisma.user.count({
                where: {
                    OR: [
                        { role: 'MEMBER' },
                        { role: 'PM' },
                    ],
                },
            });

            const divisionCount = await prisma.division.count();
            const projectCount = await prisma.project.count();

            res.status(200).json({
                error: false,
                message: 'Data retrieved successfully',
                data: {
                    userCount,
                    divisionCount,
                    projectCount,
                },
            });
        } catch (err) {
            res.status(500).json({
                error: true,
                message: 'Error retrieving data',
                errorDetail: err.message,
            });
        }
    },


};

module.exports = dashboardController;