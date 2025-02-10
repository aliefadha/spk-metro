const prisma = require('../../src/configs/database');
const { encryptPassword } = require('../../src/utils/bcrypt.js');

const seedSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await prisma.user.findUnique({
            where: { email: 'superadmin@gmail.com' },
        });

        if (existingSuperAdmin) {
            console.log('SuperAdmin already exists.');
            return;
        }

        const hashedPassword = await encryptPassword('@Test123');

        const superAdmin = await prisma.user.create({
            data: {
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
    }
};

module.exports = seedSuperAdmin;
