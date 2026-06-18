import Image from "next/image";
import { MEGASTONE_MAP } from "@/lib/megastones";
import pokemonData from "@/data/pokemon";
import { POKEAPI_VARIANT_IDS } from "@/lib/pokeapi-ids";

function getSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  // images from https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
}

function getVariantKey(mon, isMega, suffix) {
  const baseName = mon.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (isMega && suffix) {
    return `${baseName}-${suffix.toLowerCase().trim()}`;
  }

  if (!mon.form) return baseName;

  let formName = mon.form
    .toLowerCase()
    .replace("form", "")
    .trim()
    .replace(/\s+/g, "-");

  if (formName === "f") formName = "female";
  if (formName === "m") formName = "male";

  return `${baseName}-${formName}`;
}

export function TeamSprite({ pokemon, item, size = 128 }) {
  const mon = pokemonData.find((p) => p.id === pokemon);
  if (!mon) return null;

  const stoneConfig = item ? MEGASTONE_MAP[item] : null;
  const isMega = stoneConfig
    ? stoneConfig.holders.includes(pokemon.toLowerCase())
    : false;

  const variantKey = getVariantKey(mon, isMega, stoneConfig?.suffix);

  const targetId = POKEAPI_VARIANT_IDS[variantKey] || mon.dexNumber;

  const src = getSprite(targetId);

  return (
    <Image
      className={`h-[${size}] w-[${size}] object-contain`}
      src={src}
      alt={`${mon.name}${mon.form ? ` (${mon.form})` : ""}${isMega ? ` ${stoneConfig.suffix.toUpperCase()}` : ""}`}
      width={size}
      height={size}
      priority
    />
  );
}
