-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "TwoFactor" BOOLEAN,
    "secretKey" TEXT,
    "status_user" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id_stat" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "achievment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id_stat")
);

-- CreateTable
CREATE TABLE "History" (
    "id_history" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id_history")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "id_blocked_user" INTEGER NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Freind" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userId" INTEGER NOT NULL,
    "id_freind" INTEGER,

    CONSTRAINT "Freind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dm" (
    "id_dm" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recieverId" INTEGER NOT NULL,
    "unread" INTEGER NOT NULL,
    "pinned" BOOLEAN NOT NULL,

    CONSTRAINT "Dm_pkey" PRIMARY KEY ("id_dm")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outgoing" BOOLEAN NOT NULL,
    "incoming" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "idDm" INTEGER NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id_channel" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id_channel")
);

-- CreateTable
CREATE TABLE "MemberChannel" (
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status_UserInChannel" TEXT NOT NULL,
    "period" TIMESTAMP(3),

    CONSTRAINT "MemberChannel_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id_disc" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id_disc")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_user_key" ON "User"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_userId_key" ON "Stat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "History_userId_key" ON "History"("userId");

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freind" ADD CONSTRAINT "Freind_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dm" ADD CONSTRAINT "Dm_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_idDm_fkey" FOREIGN KEY ("idDm") REFERENCES "Dm"("id_dm") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberChannel" ADD CONSTRAINT "MemberChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberChannel" ADD CONSTRAINT "MemberChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id_channel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_userId_channelId_fkey" FOREIGN KEY ("userId", "channelId") REFERENCES "MemberChannel"("userId", "channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
