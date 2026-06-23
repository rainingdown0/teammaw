import Image from "next/image";
import { MEGASTONE_MAP } from "@/lib/megastones";
import pokemonData from "@/data/pokemon";
import { POKEAPI_VARIANT_IDS } from "@/lib/pokeapi-ids";

function getPokemonSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  // images from https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
}
function getItemSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen9/${id}.png`;
  // images from https://github.com/PokeAPI/sprites/tree/master/sprites/items/gen9
}

function getVariantKey(mon, isMega, suffix) {
  const baseName = mon.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  if (isMega && suffix) return `${baseName}-${suffix.toLowerCase().trim()}`;
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
function getItemKey(item) {
  return item.toLowerCase().replace(/\s+/g, "-");
}

export function TeamSprite({ pokemon, item, size = 128 }) {
  const mon = pokemonData.find((p) => p.id === pokemon);
  if (!mon) return null;

  const stoneConfig = item ? MEGASTONE_MAP[item.toLowerCase()] : null;
  const isMega = stoneConfig
    ? stoneConfig.holders.includes(pokemon.toLowerCase())
    : false;
  const variantKey = getVariantKey(mon, isMega, stoneConfig?.suffix);
  const targetId = POKEAPI_VARIANT_IDS[variantKey] || mon.dexNumber;
  const src = getPokemonSprite(targetId);

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

export function ItemSprite({ item, size = 32 }) {
  const key = getItemKey(item);
  const src = getItemSprite(key);
  return (
    <Image
      className={`h-[${size}] w-[${size}] object-contain`}
      src={src}
      alt={item}
      width={size}
      height={size}
      priority
    />
  );
}
