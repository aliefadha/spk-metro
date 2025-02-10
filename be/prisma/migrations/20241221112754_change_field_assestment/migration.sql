/*
  Warnings:

  - You are about to drop the `asessmentresult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `asessmentresult` DROP FOREIGN KEY `asessmentResult_assesmentId_fkey`;

-- DropTable
DROP TABLE `asessmentresult`;

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
ALTER TABLE `assesmentResult` ADD CONSTRAINT `assesmentResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
