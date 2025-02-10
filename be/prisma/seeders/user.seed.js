const prisma = require('../../src/configs/database.js');
const { encryptPassword } = require('../../src/utils/bcrypt.js');
const { v4: uuidv4 } = require('uuid');

const seedSuperAdmin = async () => {
    try {
        console.log('Connecting to the database...');
        await prisma.$connect();

        console.log('Checking if SuperAdmin already exists...');
        const existingSuperAdmin = await prisma.user.findUnique({
            where: { email: 'superadmin@gmail.com' },
        });

        if (existingSuperAdmin) {
            console.log('SuperAdmin already exists.');
            return;
        }

        console.log('Encrypting password...');
        const hashedPassword = await encryptPassword('@Test123');

        console.log('Creating SuperAdmin...');
        const superAdmin = await prisma.user.create({
            data: {
                id: uuidv4(),
                fullName: 'Super Admin',
                email: 'superadmin@gmail.com',
                role: 'SUPERADMIN',
                password: hashedPassword,
                divisionId: null,
            },
        });

        console.log('SuperAdmin account created:', superAdmin);
    } catch (err) {
        console.error('Error seeding SuperAdmin account:', err);
    } finally {
        await prisma.$disconnect();
        console.log('Database connection closed.');
    }
};

module.exports = seedSuperAdmin;
