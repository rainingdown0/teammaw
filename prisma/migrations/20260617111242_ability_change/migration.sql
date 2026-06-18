/*
  Warnings:

  - You are about to drop the column `abilityId` on the `TeamPokemon` table. All the data in the column will be lost.
  - Added the required column `ability` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamPokemon" DROP COLUMN "abilityId",
ADD COLUMN     "ability" VARCHAR(50) NOT NULL;
