-- CreateTable
CREATE TABLE "Achievments" (
    "id" SERIAL NOT NULL,
    "achieve" TEXT,
    "msg" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Achievments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievments" ADD CONSTRAINT "Achievments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
