export function getPokemonSprite(pokemon) {
  return `https://img.pokemondb.net/sprites/home/normal/${pokemon}.png`;
}

export function getMegaSprite(pokemon, suffix) {
  return `https://img.pokemondb.net/sprites/home/normal/${pokemon}-${suffix}.png`;
}
