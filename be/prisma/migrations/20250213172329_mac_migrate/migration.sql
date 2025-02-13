/*
  Warnings:

  - You are about to drop the `assesmentresult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `metricnormalization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `metricresult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectcollaborator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `char` to the `metric` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assesmentresult` DROP FOREIGN KEY `assesmentResult_assesmentId_fkey`;

-- DropForeignKey
ALTER TABLE `metricnormalization` DROP FOREIGN KEY `metricNormalization_assesmentId_fkey`;

-- DropForeignKey
ALTER TABLE `metricresult` DROP FOREIGN KEY `metricResult_assesmentId_fkey`;

-- DropForeignKey
ALTER TABLE `projectcollaborator` DROP FOREIGN KEY `projectCollaborator_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `projectcollaborator` DROP FOREIGN KEY `projectCollaborator_userId_fkey`;

-- AlterTable
ALTER TABLE `metric` ADD COLUMN `char` ENUM('Cost', 'Benefit') NOT NULL;

-- DropTable
DROP TABLE `assesmentresult`;

-- DropTable
DROP TABLE `metricnormalization`;

-- DropTable
DROP TABLE `metricresult`;

-- DropTable
DROP TABLE `projectcollaborator`;

-- CreateTable
CREATE TABLE `projectCollaborator` (
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `isProjectManager` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`projectId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metricResult` (
    `id` VARCHAR(191) NOT NULL,
    `totalUtility` DOUBLE NOT NULL,
    `vikorIndex` DOUBLE NOT NULL,
    `maximumDeviation` DOUBLE NOT NULL,
    `assesmentId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metricNormalization` (
    `id` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `assesmentId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assesmentResult` (
    `id` VARCHAR(191) NOT NULL,
    `skor` DOUBLE NOT NULL,
    `status` ENUM('ACHIEVED', 'NOTACHIEVED') NOT NULL,
    `isPersonal` BOOLEAN NOT NULL,
    `assesmentId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projectCollaborator` ADD CONSTRAINT `projectCollaborator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projectCollaborator` ADD CONSTRAINT `projectCollaborator_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricResult` ADD CONSTRAINT `metricResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricNormalization` ADD CONSTRAINT `metricNormalization_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assesmentResult` ADD CONSTRAINT `assesmentResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
