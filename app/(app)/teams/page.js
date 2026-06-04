import { Team } from "@/app/ui/team";

export default function Page() {
  const team = {
    name: "strongest team ever",
    format: "m-a",
    isPublic: false,
    pokemon: [
      {
        slot: 1,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
      {
        slot: 2,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
      {
        slot: 3,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
      {
        slot: 4,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
      {
        slot: 5,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
      {
        slot: 6,
        pokemonId: "incineroar",
        itemId: "sitrusberry",
      },
    ],
  };

  return (
    <>
      <Team team={team} />
    </>
  );
}
