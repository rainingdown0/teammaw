import { DiscoverTeam } from "@/app/ui/team";

export default function Page() {
  const team = {
    name: "Indianapolis Regional",
    format: "m-a",
    isPublic: true,
    user: {
      username: "WolfeyVGC",
    },
    pokemon: [
      {
        slot: 1,
        pokemonId: "sneasler",
        itemId: "",
      },
      {
        slot: 2,
        pokemonId: "sinistcha",
        itemId: "",
      },
      {
        slot: 3,
        pokemonId: "talonflame",
        itemId: "",
      },
      {
        slot: 4,
        pokemonId: "steelix",
        itemId: "steelixite",
      },
      {
        slot: 5,
        pokemonId: "rotomwash",
        itemId: "",
      },
      {
        slot: 6,
        pokemonId: "tyranitar",
        itemId: "tyranitarite",
      },
    ],
    likes: [{}, {}, {}],
  };

  return (
    <>
      <DiscoverTeam team={team} />
    </>
  );
}
