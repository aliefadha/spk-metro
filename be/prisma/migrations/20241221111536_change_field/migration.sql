-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_divisionId_fkey`;

-- DropIndex
DROP INDEX `user_divisionId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `divisionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
