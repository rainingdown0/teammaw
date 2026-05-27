/**
 * TEAMMAW — Learnset populator
 *
 * Run after fetch-data.mjs:
 *   node scripts/populate-learnsets.mjs
 *
 * Reads the keys from data/learnsets.json and fills each entry
 * with moves learned in Gen 7, 8, or 9 combined.
 *
 * This is a baseline — manually fix Champions-specific changes after:
 *   - Moves Champions removed: https://www.serebii.net/pokemonchampions/moves.shtml
 *   - Learnset changes per Pokemon: https://www.serebii.net/pokedex-champions/
 *
 * Will NOT overwrite learnsets that have already been filled in.
 */

import { Dex } from "@pkmn/dex";
import { Generations } from "@pkmn/data";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEARNSETS_PATH = path.join(__dirname, "../data/learnsets.json");

const gens = new Generations(Dex);

async function getCombinedLearnset(id) {
  const moves = new Set();
  for (const genNum of [9]) {
    const gen = gens.get(genNum);
    const data = await gen.learnsets.get(id);
    if (data?.learnset) {
      for (const move of Object.keys(data.learnset)) {
        moves.add(move);
      }
    }
  }
  return [...moves].sort();
}

async function main() {
  console.log("TEAMMAW — Learnset Populator");
  console.log("==================================");

  const learnsets = JSON.parse(await fs.readFile(LEARNSETS_PATH, "utf-8"));

  const ids = Object.keys(learnsets);
  const toFill = ids.filter((id) => learnsets[id].length === 0);
  const skipped = ids.length - toFill.length;

  console.log(`\nTotal entries: ${ids.length}`);
  console.log(`Already filled: ${skipped} (skipping)`);
  console.log(`To fill: ${toFill.length}\n`);

  let filled = 0;
  let empty = 0;

  for (const id of toFill) {
    const moves = await getCombinedLearnset(id);

    if (moves.length === 0) {
      console.log(`  ⚠ ${id}: no moves found`);
      empty++;
    } else {
      console.log(`  ✓ ${id}: ${moves.length} moves`);
      filled++;
    }

    learnsets[id] = moves;
  }

  await fs.writeFile(LEARNSETS_PATH, JSON.stringify(learnsets, null, 2));

  console.log("\n==================================");
  console.log(`✅ Done!`);
  console.log(`   Filled: ${filled}`);
  if (skipped > 0) console.log(`   Skipped (already had data): ${skipped}`);
  if (empty > 0)
    console.log(`   ⚠ Empty (no data found): ${empty} — fill manually`);
  console.log(`\nNext: manually correct Champions-specific learnset changes`);
  console.log(`  https://www.serebii.net/pokedex-champions/`);
}

main().catch(console.error);
