/*
  Warnings:

  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currencies" TEXT[];

-- DropTable
DROP TABLE "Currency";
