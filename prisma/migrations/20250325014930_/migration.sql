/*
  Warnings:

  - Added the required column `currency` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN "currency" TEXT DEFAULT 'USD';
UPDATE "Expense" SET "currency" = 'USD' WHERE "currency" IS NULL;
ALTER TABLE "Expense" ALTER COLUMN "currency" SET NOT NULL;
