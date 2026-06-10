/*
  Warnings:

  - Added the required column `evAtk` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evDef` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evHp` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evSpa` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evSpd` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evSpe` to the `TeamPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamPokemon" ADD COLUMN     "evAtk" INTEGER NOT NULL,
ADD COLUMN     "evDef" INTEGER NOT NULL,
ADD COLUMN     "evHp" INTEGER NOT NULL,
ADD COLUMN     "evSpa" INTEGER NOT NULL,
ADD COLUMN     "evSpd" INTEGER NOT NULL,
ADD COLUMN     "evSpe" INTEGER NOT NULL;
