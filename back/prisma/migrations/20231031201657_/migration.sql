-- AlterTable
ALTER TABLE "History" ADD COLUMN     "winner" BOOLEAN;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "games_played" INTEGER,
ADD COLUMN     "losses" INTEGER,
ADD COLUMN     "wins" INTEGER;
