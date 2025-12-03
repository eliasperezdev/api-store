/*
  Warnings:

  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `image` VARCHAR(191) NOT NULL DEFAULT 'https://placehold.co/600x400';
