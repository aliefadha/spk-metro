/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add userId column as nullable
ALTER TABLE `user` ADD COLUMN `userId` VARCHAR(191);

-- Step 2: Populate userId for existing users with sequential format
SET @row_number = 0;
UPDATE `user` SET `userId` = CONCAT('USR-', LPAD(@row_number := @row_number + 1, 4, '0')) WHERE `userId` IS NULL;

-- Step 3: Make userId column required
ALTER TABLE `user` MODIFY COLUMN `userId` VARCHAR(191) NOT NULL;

-- Step 4: Create unique index
CREATE UNIQUE INDEX `user_userId_key` ON `user`(`userId`);
