/*
  Warnings:

  - Added the required column `concat(FirstName, ' ', LastName)` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `concat(FirstName, ' ', LastName)` VARCHAR(191) NOT NULL;
