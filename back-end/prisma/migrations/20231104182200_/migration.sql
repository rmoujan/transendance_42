/*
  Warnings:

  - You are about to drop the column `recieverId` on the `Dm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Dm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Dm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dm" DROP COLUMN "recieverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dm_senderId_receiverId_key" ON "Dm"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Dm" ADD CONSTRAINT "Dm_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
