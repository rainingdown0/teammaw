/*
  Warnings:

  - You are about to alter the column `title` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `replicaId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `format` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `pokemonId` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nickname` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(18)`.
  - You are about to alter the column `teraType` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `abilityId` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `itemId` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nature` on the `TeamPokemon` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `moveId` on the `TeamPokemonMove` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "title" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "replicaId" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "format" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "TeamPokemon" ALTER COLUMN "pokemonId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(18),
ALTER COLUMN "teraType" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "abilityId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "itemId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "nature" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "TeamPokemonMove" ALTER COLUMN "moveId" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
