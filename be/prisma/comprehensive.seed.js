const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.assesmentResult.deleteMany({});
  await prisma.metricNormalization.deleteMany({});
  await prisma.metricResult.deleteMany({});
  await prisma.assesment.deleteMany({});
  await prisma.assesmentNonDev.deleteMany({});
  await prisma.projectCollaborator.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.metric.deleteMany({});
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.division.deleteMany({});

  // Seed Divisions
  console.log('🏢 Seeding divisions...');
  const divisions = [
    {
      id: 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5',
      divisionName: 'Marketing',
    },
    {
      id: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      divisionName: 'Developer',
    }
  ];

  for (const division of divisions) {
    await prisma.division.create({
      data: division
    });
  }

  // Seed Users
  console.log('👥 Seeding users...');
  const hashedPassword = await bcrypt.hash('@Test123', 10);
  const users = [
    {
      id: '24a916f3-0a96-4bca-9b15-3c991455d0e6',
      email: 'mhdulilabshar@example.com',
      password: hashedPassword,
      fullName: 'Mhd Ulil Abshar',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:08:47.742'),
      updated_at: new Date('2025-04-22 19:37:03.651')
    },
    {
      id: '447384ec-4fe3-4663-9807-5c02cddf07af',
      email: 'aliefadha@example.com',
      password: hashedPassword,
      fullName: 'Alief Adha',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:09:37.599'),
      updated_at: new Date('2025-02-17 02:51:55.395')
    },
    {
      id: '48620d76-1a4a-49dc-ad17-50a3a3bf8854',
      email: 'nadiniannisabyant@example.com',
      password: hashedPassword,
      fullName: 'Nadini Annisa Byant',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:08:30.709'),
      updated_at: new Date('2025-02-15 11:08:30.709')
    },
    {
      id: '52b3927e-6f55-4dac-9ecc-fc47f10170a3',
      email: 'iqbaldefriprasetya@example.com',
      password: hashedPassword,
      fullName: 'Iqbal Defri Prasetya',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:08:39.931'),
      updated_at: new Date('2025-02-15 11:08:39.931')
    },
    {
      id: '54fb284d-d47e-4dd5-a4e7-dc15b4e7e1c5',
      email: 'hagisirajsumanta@example.com',
      password: hashedPassword,
      fullName: 'Hagi Siraj Sumanta',
      role: 'MEMBER',
      divisionId: 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5',
      created_at: new Date('2025-02-15 11:08:08.399'),
      updated_at: new Date('2025-02-15 11:08:08.399')
    },
    {
      id: '625b80de-1812-40bf-8397-e9d9132ff3eb',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      fullName: 'Super Admin',
      role: 'SUPERADMIN',
      divisionId: null,
      created_at: new Date('2025-02-13 17:29:22.447'),
      updated_at: new Date('2025-02-13 17:29:22.447')
    },
    {
      id: '700d9d1e-e177-433c-898c-4db78fdc12dd',
      email: 'daffarizamuliya@example.com',
      password: hashedPassword,
      fullName: 'Daffa Riza Muliya',
      role: 'MEMBER',
      divisionId: 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5',
      created_at: new Date('2025-02-15 11:07:53.390'),
      updated_at: new Date('2025-02-15 11:07:53.390')
    },
    {
      id: '9637f8d1-8e31-4136-9fa3-7bb6716558b5',
      email: 'deliciasyifamaghfira@example.com',
      password: hashedPassword,
      fullName: 'Delicia Syifa Maghfira',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:09:50.281'),
      updated_at: new Date('2025-02-15 11:09:50.281')
    },
    {
      id: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      email: 'hamzahabdillaharif@example.com',
      password: hashedPassword,
      fullName: 'Hamzah Abdillah Arif',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:09:22.744'),
      updated_at: new Date('2025-02-15 11:09:22.744')
    },
    {
      id: 'c1744d47-0ce6-4e45-adf1-ed4b13c6e916',
      email: 'fajaralifriyandi@example.com',
      password: hashedPassword,
      fullName: 'Fajar Alif Riyandi',
      role: 'MEMBER',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 11:08:57.990'),
      updated_at: new Date('2025-02-15 11:08:57.990')
    },
    {
      id: 'f7e2f29b-c164-496d-a617-2559b296e1cb',
      email: 'muhammadfaizabrar@example.com',
      password: hashedPassword,
      fullName: 'Muhammad Faiz Abrar',
      role: 'MEMBER',
      divisionId: 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5',
      created_at: new Date('2025-02-15 11:08:21.023'),
      updated_at: new Date('2025-02-15 11:08:21.023')
    }
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user
    });
  }

  // Seed Metrics
  console.log('📊 Seeding metrics...');
  const metrics = [
    {
      id: '0eb5863d-b6c2-4325-b043-f2196bfca8c3',
      kodeKpi: 'K001',
      kpiName: 'Velocity',
      target: 90.0,
      bobot: 5.0,
      char: 'Benefit',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 10:30:00.000'),
      updated_at: new Date('2025-05-13 09:27:57.497')
    },
    {
      id: 'f37e9484-183e-47f1-90c6-fc30e0be0036',
      kodeKpi: 'K002',
      kpiName: 'Change Failure Rate (CFR)',
      target: 85.0,
      bobot: 5.0,
      char: 'Cost',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 10:31:00.000'),
      updated_at: new Date('2025-05-13 09:28:15.277')
    },
    {
      id: 'bd894298-8249-445f-ade8-f9feaf87ba6c',
      kodeKpi: 'K003',
      kpiName: 'Code Quality',
      target: 85.0,
      bobot: 5.0,
      char: 'Benefit',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 10:32:00.000'),
      updated_at: new Date('2025-05-13 09:28:10.746')
    },
    {
      id: '24d540f9-777d-4938-a2fb-a4dc042f07b4',
      kodeKpi: 'K004',
      kpiName: 'On-Time Delivery',
      target: 90.0,
      bobot: 5.0,
      char: 'Benefit',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 10:33:00.000'),
      updated_at: new Date('2025-05-13 09:28:02.140')
    },
    {
      id: 'b1dcf949-4cbd-4913-980f-33f9b60aec50',
      kodeKpi: 'K005',
      kpiName: 'Team Collaboration',
      target: 90.0,
      bobot: 5.0,
      char: 'Benefit',
      divisionId: 'e0b4374f-3403-4e5d-97af-398e0cec468d',
      created_at: new Date('2025-02-15 10:34:00.000'),
      updated_at: new Date('2025-05-13 09:28:06.730')
    },
  ];

  for (const metric of metrics) {
    await prisma.metric.create({
      data: metric
    });
  }

  // Seed Projects
  console.log('📁 Seeding projects...');
  const projects = [
    {
      id: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      projectName: 'Ilmu Komunikasi',
      bobot: 1.0,
      deadline: '2025-05-18',
      tanggal_selesai: '2025-05-18', // Added completion date
      status: 'DONE',
      created_at: new Date('2025-05-18 09:17:29.846'),
      updated_at: new Date('2025-05-18 09:17:37.859')
    },
    {
      id: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      projectName: 'PT Ajakan Digital Indonesia',
      bobot: 3.0,
      deadline: '2025-05-17',
      tanggal_selesai: '2025-05-17', // Added completion date
      status: 'DONE',
      created_at: new Date('2025-05-17 10:30:37.102'),
      updated_at: new Date('2025-05-18 09:16:55.713')
    }
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project
    });
  }

  // Seed Project Collaborators
  console.log('🤝 Seeding project collaborators...');
  const projectCollaborators = [
    {
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      userId: '52b3927e-6f55-4dac-9ecc-fc47f10170a3',
      isProjectManager: false,
      created_at: new Date('2025-05-18 09:17:37.859'),
      updated_at: new Date('2025-05-18 09:17:37.859')
    },
    {
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      userId: '700d9d1e-e177-433c-898c-4db78fdc12dd',
      isProjectManager: true,
      created_at: new Date('2025-05-18 09:17:37.859'),
      updated_at: new Date('2025-05-18 09:17:37.859')
    },
    {
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      userId: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      isProjectManager: false,
      created_at: new Date('2025-05-18 09:17:37.859'),
      updated_at: new Date('2025-05-18 09:17:37.859')
    },
    {
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      userId: '24a916f3-0a96-4bca-9b15-3c991455d0e6',
      isProjectManager: false,
      created_at: new Date('2025-05-18 09:16:55.713'),
      updated_at: new Date('2025-05-18 09:16:55.713')
    },
    {
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      userId: '447384ec-4fe3-4663-9807-5c02cddf07af',
      isProjectManager: false,
      created_at: new Date('2025-05-18 09:16:55.713'),
      updated_at: new Date('2025-05-18 09:16:55.713')
    },
    {
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      userId: '700d9d1e-e177-433c-898c-4db78fdc12dd',
      isProjectManager: true,
      created_at: new Date('2025-05-18 09:16:55.713'),
      updated_at: new Date('2025-05-18 09:16:55.713')
    }
  ];

  for (const collaborator of projectCollaborators) {
    await prisma.projectCollaborator.create({
      data: collaborator
    });
  }

  // Seed Assessments
  console.log('📝 Seeding assessments...');
  const assessments = [
    {
      id: '02f7b35e-e00b-48a3-a770-ee82e3e3a034',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: '0eb5863d-b6c2-4325-b043-f2196bfca8c3',
      userId: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      value: 34,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:18:08.967')
    },
    {
      id: '0f96d901-ca39-4657-a8f3-8ecc88007381',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: '24d540f9-777d-4938-a2fb-a4dc042f07b4',
      userId: '52b3927e-6f55-4dac-9ecc-fc47f10170a3',
      value: 42,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:17:53.269')
    },
    {
      id: '1730e99f-125c-4e62-994a-58fd6bfd9c49',
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      metricId: 'f37e9484-183e-47f1-90c6-fc30e0be0036',
      userId: '447384ec-4fe3-4663-9807-5c02cddf07af',
      value: 55,
      assesmentDate: '2025-05-17',
      created_at: new Date('2025-05-17 10:30:37.114'),
      updated_at: new Date('2025-05-18 02:03:43.885')
    },
    {
      id: '18ccc6d3-0d07-4005-b4a3-15bd0ba027df',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: 'bd894298-8249-445f-ade8-f9feaf87ba6c',
      userId: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      value: 22,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:18:08.967')
    },
    {
      id: '4c2e1df1-18a9-4716-bb8d-ef1085baf367',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: 'f37e9484-183e-47f1-90c6-fc30e0be0036',
      userId: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      value: 34,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:18:08.967')
    },
    {
      id: '53b81400-b33b-41f3-aee7-1f1d7a8a2338',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: 'b1dcf949-4cbd-4913-980f-33f9b60aec50',
      userId: '52b3927e-6f55-4dac-9ecc-fc47f10170a3',
      value: 23,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:17:53.269')
    },
    {
      id: '5ce483c8-bc9e-43b3-a5c3-1e91d8dff325',
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      metricId: '0eb5863d-b6c2-4325-b043-f2196bfca8c3',
      userId: '447384ec-4fe3-4663-9807-5c02cddf07af',
      value: 54,
      assesmentDate: '2025-05-17',
      created_at: new Date('2025-05-17 10:30:37.114'),
      updated_at: new Date('2025-05-18 02:03:43.885')
    },
    {
      id: '7a0aa078-2c43-442f-8457-4b133b3ba0f8',
      projectId: 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6',
      metricId: '24d540f9-777d-4938-a2fb-a4dc042f07b4',
      userId: '24a916f3-0a96-4bca-9b15-3c991455d0e6',
      value: 54,
      assesmentDate: '2025-05-17',
      created_at: new Date('2025-05-17 10:30:37.114'),
      updated_at: new Date('2025-05-17 10:31:06.219')
    },
    {
      id: '8fc70b27-831b-4527-80e9-8cd3ff96685d',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: 'bd894298-8249-445f-ade8-f9feaf87ba6c',
      userId: '52b3927e-6f55-4dac-9ecc-fc47f10170a3',
      value: 45,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:17:53.269')
    },
    {
      id: '95eb21e7-ae1e-4629-adaf-a84836884e3d',
      projectId: '53c5456e-c40a-456b-9c30-b647fd1b4637',
      metricId: '24d540f9-777d-4938-a2fb-a4dc042f07b4',
      userId: 'be4e3112-45fa-44ae-8048-aaeb9b8dd706',
      value: 54,
      assesmentDate: '2025-05-18',
      created_at: new Date('2025-05-18 09:17:29.861'),
      updated_at: new Date('2025-05-18 09:18:08.967')
    }
  ];

  for (const assessment of assessments) {
    await prisma.assesment.create({
      data: assessment
    });
  }

  console.log('✅ Comprehensive seeding completed successfully!');
  console.log('📊 Data seeded:');
  console.log(`  - ${divisions.length} divisions`);
  console.log(`  - ${users.length} users`);
  console.log(`  - ${metrics.length} metrics`);
  console.log(`  - ${projects.length} projects`);
  console.log(`  - ${projectCollaborators.length} project collaborators`);
  console.log(`  - ${assessments.length} assessments`);
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('  Super Admin: superadmin@gmail.com / @Test123');
  console.log('  All other users: [email] / @Test123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });