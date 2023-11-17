/*
  Warnings:

  - You are about to drop the column `recieverId` on the `Dm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Dm` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `outgoing` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `incoming` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `receiverId` to the `Dm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "img" TEXT;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "outgoing",
ADD COLUMN     "outgoing" INTEGER NOT NULL,
DROP COLUMN "incoming",
ADD COLUMN     "incoming" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Dm" DROP COLUMN "recieverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MemberChannel" ADD COLUMN     "muted" BOOLEAN;

-- CreateTable
CREATE TABLE "ChannelBan" (
    "bannedUserId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status_User" TEXT NOT NULL,

    CONSTRAINT "ChannelBan_pkey" PRIMARY KEY ("bannedUserId","channelId")
);

-- CreateTable
CREATE TABLE "saveBanned" (
    "id" SERIAL NOT NULL,
    "bannedUserId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status_User" TEXT NOT NULL,

    CONSTRAINT "saveBanned_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dm_senderId_receiverId_key" ON "Dm"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Dm" ADD CONSTRAINT "Dm_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelBan" ADD CONSTRAINT "ChannelBan_bannedUserId_channelId_fkey" FOREIGN KEY ("bannedUserId", "channelId") REFERENCES "MemberChannel"("userId", "channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
