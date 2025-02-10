const prisma = require('../src/configs/database');

const clearDatabase = async () => {
    try {
        console.log('Clearing all data from the database...');

        await prisma.token.deleteMany();
        await prisma.user.deleteMany();
        await prisma.projectCollaborator.deleteMany();
        await prisma.project.deleteMany();
        await prisma.metric.deleteMany();
        await prisma.assesment.deleteMany();
        await prisma.metricResult.deleteMany();
        await prisma.metricNormalization.deleteMany();
        await prisma.assesmentResult.deleteMany();
        await prisma.division.deleteMany();

        console.log('All data cleared from the database.');
    } catch (err) {
        console.error('Error clearing database:', err);
    } finally {
        await prisma.$disconnect();
    }
};

clearDatabase()