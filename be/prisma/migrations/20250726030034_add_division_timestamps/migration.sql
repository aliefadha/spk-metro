/*
  Warnings:

  - Added the required column `updated_at` to the `division` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `division` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `assesmentNonDev_userId_fkey` ON `assesmentNonDev`(`userId`);

-- AddForeignKey
ALTER TABLE `assesmentNonDev` ADD CONSTRAINT `assesmentNonDev_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
