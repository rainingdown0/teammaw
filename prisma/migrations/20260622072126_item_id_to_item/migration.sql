/*
  Warnings:

  - You are about to drop the column `itemId` on the `TeamPokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamPokemon" DROP COLUMN "itemId",
ADD COLUMN     "item" VARCHAR(50);
