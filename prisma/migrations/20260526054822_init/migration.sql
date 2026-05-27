-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isLegal" BOOLEAN NOT NULL DEFAULT false,
    "regulation" TEXT NOT NULL DEFAULT 'm-a',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPokemon" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "pokemonId" TEXT NOT NULL,
    "nickname" TEXT,
    "teraType" TEXT,
    "abilityId" TEXT NOT NULL,
    "itemId" TEXT,
    "nature" TEXT NOT NULL,
    "evHp" INTEGER NOT NULL DEFAULT 0,
    "evAtk" INTEGER NOT NULL DEFAULT 0,
    "evDef" INTEGER NOT NULL DEFAULT 0,
    "evSpAtk" INTEGER NOT NULL DEFAULT 0,
    "evSpDef" INTEGER NOT NULL DEFAULT 0,
    "evSpe" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TeamPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPokemonMove" (
    "id" TEXT NOT NULL,
    "teamPokemonId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "moveId" TEXT NOT NULL,

    CONSTRAINT "TeamPokemonMove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPokemon_teamId_slot_key" ON "TeamPokemon"("teamId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPokemonMove_teamPokemonId_slot_key" ON "TeamPokemonMove"("teamPokemonId", "slot");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemonMove" ADD CONSTRAINT "TeamPokemonMove_teamPokemonId_fkey" FOREIGN KEY ("teamPokemonId") REFERENCES "TeamPokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
