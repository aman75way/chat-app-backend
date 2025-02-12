/*
  Warnings:

  - You are about to drop the column `partcipantIds` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "partcipantIds",
ADD COLUMN     "participantIds" TEXT[];
