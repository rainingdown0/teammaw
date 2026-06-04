/*
  Warnings:

  - You are about to drop the column `evAtk` on the `TeamPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evDef` on the `TeamPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evHp` on the `TeamPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evSpAtk` on the `TeamPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evSpDef` on the `TeamPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evSpe` on the `TeamPokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamPokemon" DROP COLUMN "evAtk",
DROP COLUMN "evDef",
DROP COLUMN "evHp",
DROP COLUMN "evSpAtk",
DROP COLUMN "evSpDef",
DROP COLUMN "evSpe";
