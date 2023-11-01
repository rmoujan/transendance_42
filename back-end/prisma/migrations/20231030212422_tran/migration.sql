/*
  Warnings:

  - You are about to drop the column `name` on the `Freind` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id_freind` on table `Freind` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Freind" DROP COLUMN "name",
ALTER COLUMN "id_freind" SET NOT NULL;

-- AlterTable
ALTER TABLE "MemberChannel" ADD COLUMN     "muted" BOOLEAN;

-- CreateTable
CREATE TABLE "ChannelBan" (
    "bannedUserId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status_User" TEXT NOT NULL,

    CONSTRAINT "ChannelBan_pkey" PRIMARY KEY ("bannedUserId","channelId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "ChannelBan" ADD CONSTRAINT "ChannelBan_bannedUserId_channelId_fkey" FOREIGN KEY ("bannedUserId", "channelId") REFERENCES "MemberChannel"("userId", "channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
