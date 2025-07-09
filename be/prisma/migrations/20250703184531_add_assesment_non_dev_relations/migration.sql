/*
  Warnings:

  - Added the required column `divisionId` to the `metric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assesmentResult` ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `metric` ADD COLUMN `divisionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `metricNormalization` ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `metricResult` ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `assesmentNonDev` (
    `id` VARCHAR(191) NOT NULL,
    `metricId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `assesmentDate` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assesmentNonDev` ADD CONSTRAINT `assesmentNonDev_metricId_fkey` FOREIGN KEY (`metricId`) REFERENCES `metric`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricResult` ADD CONSTRAINT `metricResult_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metricNormalization` ADD CONSTRAINT `metricNormalization_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assesmentResult` ADD CONSTRAINT `assesmentResult_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
