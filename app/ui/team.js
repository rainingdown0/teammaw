import { TeamSprite } from "@/app/ui/sprite";
import Icon from "@/app/ui/icons";
import { getFormat } from "@/lib/format";

export function Team({ team }) {
  return (
    <div className="flex w-210 flex-col gap-4 rounded-2xl bg-base-base p-4">
      <h2 className="w-full font-bold">{team.name}</h2>
      <div className="flex w-full gap-2">
        <TeamSprite
          pokemon={team.pokemon[0].pokemonId}
          item={team.pokemon[0].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[1].pokemonId}
          item={team.pokemon[1].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[2].pokemonId}
          item={team.pokemon[2].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[3].pokemonId}
          item={team.pokemon[3].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[4].pokemonId}
          item={team.pokemon[4].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[5].pokemonId}
          item={team.pokemon[5].itemId}
        />
      </div>
      <div className="flex w-full items-center gap-8">
        <div className="flex w-full items-center gap-4 text-small">
          <span>{getFormat(team.format)}</span>
          <span>{team.isPublic ? "Public" : "Private"}</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon
            name="import"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
          <Icon
            name="copy"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
          <Icon
            name="trash"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export function DiscoverTeam({ team }) {
  return (
    <div className="flex w-210 flex-col gap-4 rounded-2xl bg-base-base p-4">
      <div className="flex flex-col">
        <h2 className="w-full font-bold">{team.name}</h2>
        <p className="w-full text-base-text-darker">@{team.user.username}</p>
      </div>
      <div className="flex w-full gap-2">
        <TeamSprite
          pokemon={team.pokemon[0].pokemonId}
          item={team.pokemon[0].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[1].pokemonId}
          item={team.pokemon[1].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[2].pokemonId}
          item={team.pokemon[2].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[3].pokemonId}
          item={team.pokemon[3].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[4].pokemonId}
          item={team.pokemon[4].itemId}
        />
        <TeamSprite
          pokemon={team.pokemon[5].pokemonId}
          item={team.pokemon[5].itemId}
        />
      </div>
      <div className="flex w-full items-center gap-8">
        <div className="flex w-full items-center gap-4 text-small">
          <span>{getFormat(team.format)}</span>
          <div className="flex cursor-pointer items-center gap-2">
            <Icon name="heart" color="fill-base-text" />
            <span>{team.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
