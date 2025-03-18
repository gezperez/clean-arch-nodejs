/*
  Warnings:

  - Added the required column `currency` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL;
