/*
  Warnings:

  - You are about to drop the column `currencies` on the `User` table. All the data in the column will be lost.
  - Added the required column `conversionCurrency` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currencies",
ADD COLUMN "conversionCurrency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
