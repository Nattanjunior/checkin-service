/*
  Warnings:

  - You are about to drop the column `validetedAt` on the `check_ins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "check_ins" DROP COLUMN "validetedAt",
ADD COLUMN     "validatedAt" TIMESTAMP(3);
