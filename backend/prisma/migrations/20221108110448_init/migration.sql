-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "headline" VARCHAR(100),
    "avatar" TEXT,
    "likes" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "favorites" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "projectsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "resetToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(20) NOT NULL,
    "description" VARCHAR(80) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "allowedUsers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "fileStructure" JSON NOT NULL,
    "githubRepo" JSON NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Project_title_key" ON "Project"("title");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
