const seedSuperAdmin = require('./seeders/user.seed');
const seedDivisions = require('./seeders/division.seed');

const mainSeeder = async () => {
    console.log('Starting database seeding...');

    try {
        await seedSuperAdmin();
        await seedDivisions();
  
        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error occurred during database seeding:', error);
    } finally {
        process.exit(0);
    }
};

mainSeeder();
