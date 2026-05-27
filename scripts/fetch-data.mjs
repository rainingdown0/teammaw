/**
 * TEAMMAW — Game data extractor
 *
 * Install deps first:
 *   npm install @pkmn/dex @pkmn/data
 *
 * Run from your project root:
 *   node scripts/fetch-data.mjs
 *
 * Outputs:
 *   data/pokemon.json    — all Champions Pokemon
 *   data/moves.json      — all moves (name, type)
 *   data/abilities.json  — all abilities (name)
 *   data/items.json      — all items including Mega Stones (name)
 *
 * Always overwritten on re-run: pokemon, moves, abilities, items
 * Never overwritten: learnsets.json (protects manual edits)
 */

import { Dex } from "@pkmn/dex";
import { Generations } from "@pkmn/data";
import fs from "fs/promises";

const gens = new Generations(Dex);
const gen9 = gens.get(9);
const gen8 = gens.get(8);
const gen7 = gens.get(7);
const gen6 = gens.get(6);

// ─── CHAMPIONS POKEMON LIST ───────────────────────────────────────────────────
// Showdown IDs: all lowercase, no spaces or hyphens
// Regional forms: raichu-alola → raichualola, slowbro-galar → slowbrogalar

const CHAMPIONS_POKEMON = [
  // Gen 1
  "venusaur", "charizard", "blastoise", "beedrill", "pidgeot",
  "arbok", "pikachu", "raichu", "raichualola", "clefable",
  "ninetales", "ninetalesalola", "arcanine", "arcaninehisui",
  "alakazam", "machamp", "victreebel", "slowbro", "slowbrogalar",
  "gengar", "kangaskhan", "starmie", "pinsir",
  "tauros", "taurospaldeacombat", "taurospaldeablaze", "taurospaldeaaqua",
  "gyarados", "ditto", "vaporeon", "jolteon", "flareon",
  "aerodactyl", "snorlax", "dragonite",
  // Gen 2
  "meganium", "typhlosion", "typhlosionhisui", "feraligatr",
  "ariados", "ampharos", "azumarill", "politoed",
  "espeon", "umbreon", "slowking", "slowkinggalar",
  "forretress", "steelix", "scizor", "heracross",
  "skarmory", "houndoom", "tyranitar",
  // Gen 3
  "pelipper", "gardevoir", "sableye", "aggron", "medicham",
  "manectric", "sharpedo", "camerupt", "torkoal", "altaria",
  "milotic", "castform", "banette", "chimecho", "absol", "glalie",
  // Gen 4
  "torterra", "infernape", "empoleon", "luxray", "roserade",
  "rampardos", "bastiodon", "lopunny", "spiritomb", "garchomp",
  "lucario", "hippowdon", "toxicroak", "abomasnow", "weavile",
  "rhyperior", "leafeon", "glaceon", "gliscor", "mamoswine",
  "gallade", "froslass", "rotom", "rotomheat", "rotomwash",
  "rotomfrost", "rotomfan", "rotommow",
  // Gen 5
  "serperior", "emboar", "samurott", "samurotthisui",
  "watchog", "liepard", "simisage", "simisear", "simipour",
  "excadrill", "audino", "conkeldurr", "whimsicott", "krookodile",
  "cofagrigus", "garbodor", "zoroark", "zoroarkhisui", "reuniclus",
  "vanilluxe", "emolga", "chandelure", "beartic",
  "stunfisk", "stunfiskgalar", "golurk", "hydreigon", "volcarona",
  // Gen 6
  "chesnaught", "delphox", "greninja", "diggersby", "talonflame",
  "vivillon", "floetteeternal", "florges", "pangoro", "furfrou",
  "meowstic", "meowsticf", "aegislash", "aromatisse", "slurpuff",
  "clawitzer", "heliolisk", "tyrantrum", "aurorus", "sylveon",
  "hawlucha", "dedenne", "goodra", "goodrahisui", "klefki",
  "trevenant", "gourgeist", "gourgeistsmall", "gourgeistlarge", "gourgeistsuper",
  "avalugg", "avalugghisui", "noivern",
  // Gen 7
  "decidueye", "decidueyehisui", "incineroar", "primarina",
  "toucannon", "crabominable",
  "lycanroc", "lycanrocmidnight", "lycanrocdusk",
  "toxapex", "mudsdale", "araquanid", "salazzle",
  "tsareena", "oranguru", "passimian", "mimikyu", "drampa", "kommoo",
  // Gen 8
  "corviknight", "flapple", "appletun", "sandaconda", "polteageist",
  "hatterene", "mrrime", "runerigus", "alcremie", "morpeko", "dragapult",
  "wyrdeer", "kleavor", "basculegion", "basculegionf", "sneasler",
  // Gen 9
  "meowscarada", "skeledirge", "quaquaval", "maushold",
  "garganacl", "armarouge", "ceruledge", "bellibolt", "scovillain",
  "espathra", "tinkaton", "palafin", "orthworm", "glimmora",
  "farigiraf", "kingambit", "sinistcha", "archaludon", "hydrapple",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSpecies(id) {
  return gen9.species.get(id)?.exists ? gen9.species.get(id)
    : gen8.species.get(id)?.exists ? gen8.species.get(id)
    : gen7.species.get(id)?.exists ? gen7.species.get(id)
    : gen6.species.get(id)?.exists ? gen6.species.get(id)
    : null;
}

function formatAbilities(obj) {
  return [obj["0"], obj["1"], obj["H"]].filter(Boolean);
}

// ─── EXTRACT POKEMON ─────────────────────────────────────────────────────────

function extractPokemon() {
  console.log("\n── Pokemon ──────────────────────────────");
  const results = [];
  const failed = [];

  for (const id of CHAMPIONS_POKEMON) {
    const s = getSpecies(id);
    if (!s) {
      console.log(`  ✗ ${id}`);
      failed.push(id);
      continue;
    }
    results.push({
      id: s.id,
      dexNumber: s.num,
      name: s.baseSpecies,
      form: s.forme || null,
      types: [...s.types],
      abilities: formatAbilities(s.abilities),
      learnsetId: s.id,
    });
    console.log(`  ✓ ${s.id}`);
  }

  if (failed.length) {
    console.log(`\n  ✗ Failed — check Showdown ID format:`);
    failed.forEach((id) => console.log(`    - ${id}`));
  }

  return results;
}

// ─── EXTRACT LEARNSETS ────────────────────────────────────────────────────────

function extractLearnsets(pokemon) {
  console.log("\n── Learnsets ────────────────────────────");
  const ids = [...new Set(pokemon.map((p) => p.learnsetId))];
  const learnsets = Object.fromEntries(ids.map((id) => [id, []]));
  console.log(`  ${ids.length} learnset stubs created`);
  return learnsets;
}

// ─── EXTRACT MOVES ────────────────────────────────────────────────────────────

function extractMoves() {
  console.log("\n── Moves ────────────────────────────────");
  const moves = Array.from(gen9.moves).map((m) => ({
    id: m.id,
    name: m.name,
    type: m.type,
  }));
  console.log(`  ${moves.length} moves`);
  return moves;
}

// ─── EXTRACT ABILITIES ────────────────────────────────────────────────────────

function extractAbilities() {
  console.log("\n── Abilities ────────────────────────────");
  const abilities = Array.from(gen9.abilities).map((a) => ({
    id: a.id,
    name: a.name,
  }));
  console.log(`  ${abilities.length} abilities`);
  return abilities;
}

// ─── EXTRACT ITEMS ────────────────────────────────────────────────────────────

function extractItems() {
  console.log("\n── Items ────────────────────────────────");

  const formatItem = (i) => ({
    id: i.id,
    name: i.name,
  });

  // Gen 7 first (includes Mega Stones), Gen 9 overwrites duplicates
  const itemMap = new Map();
  for (const i of gen7.items) itemMap.set(i.id, formatItem(i));
  for (const i of gen9.items) itemMap.set(i.id, formatItem(i));

  const items = [...itemMap.values()];
  console.log(`  ${items.length} items`);
  return items;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("TEAMMAW — Data Extractor");
  console.log("=========================");

  await fs.mkdir("./data", { recursive: true });

  const pokemon = extractPokemon();
  const moves = extractMoves();
  const abilities = extractAbilities();
  const items = extractItems();

  await Promise.all([
    fs.writeFile("./data/pokemon.json", JSON.stringify(pokemon, null, 2)),
    fs.writeFile("./data/moves.json", JSON.stringify(moves, null, 2)),
    fs.writeFile("./data/abilities.json", JSON.stringify(abilities, null, 2)),
    fs.writeFile("./data/items.json", JSON.stringify(items, null, 2)),
  ]);

  // Only write learnsets.json if it doesn't exist — protects manual edits
  try {
    await fs.access("./data/learnsets.json");
    console.log("\n── Learnsets ────────────────────────────");
    console.log("  learnsets.json already exists — skipping");
  } catch {
    const learnsets = extractLearnsets(pokemon);
    await fs.writeFile("./data/learnsets.json", JSON.stringify(learnsets, null, 2));
  }

  console.log("\n=========================");
  console.log("✅ Done!");
  console.log(`   pokemon.json    — ${pokemon.length} entries`);
  console.log(`   moves.json      — ${moves.length} moves`);
  console.log(`   abilities.json  — ${abilities.length} abilities`);
  console.log(`   items.json      — ${items.length} items`);
  console.log(`   learnsets.json  — fill manually from https://www.serebii.net/pokedex-champions/`);
}

main().catch(console.error);
