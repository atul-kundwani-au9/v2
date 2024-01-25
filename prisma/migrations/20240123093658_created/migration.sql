/*
  Warnings:

  - Added the required column `UpdatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `ManagerEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Timesheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `client` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `manageremployee` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `timesheet` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;
