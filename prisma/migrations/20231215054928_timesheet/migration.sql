/*
  Warnings:

  - Made the column `RejectionComment` on table `timesheet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `timesheet` ADD COLUMN `Comment` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `RejectionComment` VARCHAR(191) NOT NULL DEFAULT '';
