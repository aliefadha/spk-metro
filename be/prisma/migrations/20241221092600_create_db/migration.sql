-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'MEMBER', 'PM') NOT NULL,
    `divisionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projectCollaborator` (
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `isProjectManager` BOOLEAN NOT NULL,

    PRIMARY KEY (`projectId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `bobot` DOUBLE NOT NULL,
    `deadline` VARCHAR(191) NOT NULL,
    `status` ENUM('DONE', 'ONPROGRESS', 'BACKLOG') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metric` (
    `id` VARCHAR(191) NOT NULL,
    `kodeKpi` VARCHAR(191) NOT NULL,
    `kpiName` VARCHAR(191) NOT NULL,
    `target` DOUBLE NOT NULL,
    `bobot` DOUBLE NOT NULL,

    UNIQUE INDEX `metric_kodeKpi_key`(`kodeKpi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assesment` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `metricId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `assesmentDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metricResult` (
    `id` VARCHAR(191) NOT NULL,
    `totalUtility` DOUBLE NOT NULL,
    `vikorIndex` DOUBLE NOT NULL,
    `maximumDeviation` DOUBLE NOT NULL,
    `assesmentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metricNormalization` (
    `id` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `assesmentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asessmentResult` (
    `id` VARCHAR(191) NOT NULL,
    `skor` DOUBLE NOT NULL,
    `status` ENUM('ACHIEVED', 'NOTACHIEVED') NOT NULL,
    `isPersonal` BOOLEAN NOT NULL,
    `assesmentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `division` (
    `id` VARCHAR(191) NOT NULL,
    `divisionName` VARCHAR(191) NOT NULL,
    `totalMember` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projectCollaborator` ADD CONSTRAINT `projectCollaborator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projectCollaborator` ADD CONSTRAINT `projectCollaborator_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assesment` ADD CONSTRAINT `assesment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assesment` ADD CONSTRAINT `assesment_metricId_fkey` FOREIGN KEY (`metricId`) REFERENCES `metric`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricResult` ADD CONSTRAINT `metricResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricNormalization` ADD CONSTRAINT `metricNormalization_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asessmentResult` ADD CONSTRAINT `asessmentResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
