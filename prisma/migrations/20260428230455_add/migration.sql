/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date]` on the table `check_ins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_user_id_date_key" ON "check_ins"("user_id", "date");
