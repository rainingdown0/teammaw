import Image from "next/image";
import { getPokemonSprite, getMegaSprite } from "@/lib/sprites";
import { MEGASTONE_MAP } from "@/lib/megastones";
import pokemonData from "@/data/pokemon";

function getCdnSlug(mon) {
  const baseName = mon.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

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

export function TeamSprite({ pokemon, item }) {
  const mon = pokemonData.find((p) => p.id === pokemon);
  if (!mon) return null;

  const stoneConfig = item ? MEGASTONE_MAP[item] : null;
  const isMega = stoneConfig
    ? stoneConfig.holders.includes(pokemon.toLowerCase())
    : false;

  const cdnSlug = getCdnSlug(mon);

  const src = isMega
    ? getMegaSprite(cdnSlug, stoneConfig.suffix)
    : getPokemonSprite(cdnSlug);

  return (
    <Image
      className="h-32 w-32 object-contain"
      src={src}
      alt={`${mon.name}${mon.form ? ` (${mon.form})` : ""}${isMega ? ` ${stoneConfig.suffix.toUpperCase()}` : ""}`}
      width={128}
      height={128}
      priority
    />
  );
}
