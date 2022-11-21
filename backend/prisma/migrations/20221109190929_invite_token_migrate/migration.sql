/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteToken` was added to the `Project` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "inviteToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_inviteToken_key" ON "Project"("inviteToken");
