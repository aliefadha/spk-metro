
const prisma = require('../../src/configs/database');

const seedDivisions = async () => {
    try {
        const divisions = [
            { divisionName: 'Marketing', totalMember: 0 },
            { divisionName: 'Developer', totalMember: 0 },
        ];

        for (const division of divisions) {
            const existingDivision = await prisma.division.findUnique({
                where: { divisionName: division.divisionName },
            });

            if (!existingDivision) {
                await prisma.division.create({ data: division });
                console.log(`Division ${division.divisionName} created.`);
            } else {
                console.log(`Division ${division.divisionName} already exists.`);
            }
        }
    } catch (err) {
        console.error('Error seeding divisions:', err);
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = seedDivisions
