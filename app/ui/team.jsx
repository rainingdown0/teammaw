"use client";

import { TeamSprite } from "@/app/ui/sprite";
import Icon from "@/app/ui/icons";
import { getUser } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { deleteTeamAction } from "@/app/actions/delete-team";
import pokemonData from "@/data/pokemon.json";
import abilityData from "@/data/abilities.json";
import itemData from "@/data/items.json";
import moveData from "@/data/moves.json";
import natureData from "@/data/natures.json";
import formatData from "@/data/formats.json";
import clsx from "clsx";

function getFormName(mon) {
  const baseName = mon.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");

  if (!mon.form) return baseName;

  let formName = mon.form
    .toLowerCase()
    .replace("form", "")
    .trim()
    .replace(/\s+/g, "-");

  return `${baseName}-${formName}`;
}

export function Team({ team, isDiscover }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const autoOpenId = searchParams.get("open");
  const [isModalOpen, setIsModalOpen] = useState(autoOpenId === team.id);

  const handleClose = () => {
    setIsModalOpen(false);
    if (autoOpenId === team.id) {
      router.replace(pathname, { scroll: false });
    }
  };

  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    getUser(team).then((user) => {
      setUsername(`@${user.username}`);
    });
  }, [team]);
  return (
    <>
      <div
        className="flex w-210 cursor-pointer flex-col gap-4 rounded-2xl bg-base-base p-4"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div className="flex flex-col">
          <h2 className="w-full font-bold">{team.name}</h2>
          {isDiscover && (
            <span className="w-fit max-w-full cursor-pointer truncate text-base-text-darker hover:underline">
              {username}
            </span>
          )}
        </div>

        <div className="flex w-full gap-2">
          {team.pokemon ? (
            team.pokemon.map((mon) => (
              <TeamSprite
                key={mon.id}
                pokemon={mon.pokemonId}
                item={mon.itemId}
              />
            ))
          ) : (
            <span className="text-small text-base-text-darker">Empty team</span>
          )}
        </div>

        <div className="flex w-full items-center gap-8">
          <div className="flex w-full items-center gap-4 text-small">
            <span>{formatData.find((f) => f.id === team.format).name}</span>
            {isDiscover ? (
              <div className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition hover:bg-base-light">
                <Icon name="heart" color="fill-base-text" />
                <span>{team.likes.length}</span>
              </div>
            ) : (
              <>
                <span>{team.isPublic ? "Public" : "Private"}</span>
                <span
                  className={clsx(!team.isLegal ? "text-primary-light" : "")}
                >
                  {team.isLegal ? "Validated" : "Invalidated"}
                </span>
              </>
            )}
          </div>

          {!isDiscover && (
            <div
              className="flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon
                name="import"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              <Icon
                name="copy"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation;
                  deleteTeamAction(team.id);
                }}
              >
                <Icon
                  name="trash"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && !isDiscover && (
        <TeamDetails team={team} onClose={handleClose} />
      )}
    </>
  );
}

function TeamDetails({ team, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="flex h-[90dvh] w-210 flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 shadow-xl shadow-primary-lighter/40"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full items-center font-bold">
              <p className="max-w-full cursor-text truncate rounded-lg p-2 transition hover:bg-base-light">
                {team.name}
              </p>
            </div>
            <div className="flex gap-4">
              <Icon
                name="plus"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              <Icon
                name="import"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation;
                  deleteTeamAction(team.id);
                }}
              >
                <Icon
                  name="trash"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
              </div>
              <Icon
                name="expand"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              <div onClick={onClose}>
                <Icon
                  name="cross"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-8 pl-2">
            <div className="flex w-fit items-center gap-8 text-small font-medium">
              {team.isPublic && (
                <span className="whitespace-nowrap">
                  {team.likes.length} likes
                </span>
              )}
              <span>{team.isPublic ? "Public" : "Private"}</span>
              <span
                className={clsx(
                  !team.isLegal
                    ? "cursor-help text-primary-light hover:underline"
                    : "",
                )}
              >
                {team.isLegal ? "Validated" : "Invalidated"}
              </span>
            </div>
          </div>
          <div className="flex w-full items-center justify-between py-2">
            <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-base-light">
              <Icon name="dropdown" color="fill-base-text" />
              <span className="text-small font-medium">
                {formatData.find((f) => f.id === team.format).name}
              </span>
            </div>
            <div className="flex cursor-text gap-1 rounded-lg px-2 py-1 transition hover:bg-base-light">
              <span className="text-small text-base-text-darker">
                {team.replicaId ? "Replica ID" : "Enter replica ID"}
              </span>
              <span className="text-small font-medium">{team.replicaId}</span>
            </div>
          </div>
        </header>

        <div className="flex h-full flex-col gap-8 overflow-y-auto">
          <div className="flex w-full flex-col gap-4">
            {team.pokemon ? (
              team.pokemon.map((pokemon) => (
                <TeamDetailsMon
                  key={pokemon.id}
                  pokemon={pokemon}
                  pokemonCount={team.pokemon.length}
                />
              ))
            ) : (
              <span className="w-full text-center text-base-text-darker">
                This team is empty
              </span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <h3 className="p-2 font-bold">Notes</h3>
            <p
              className={clsx(
                "flex w-full cursor-text flex-col rounded-2xl bg-base-light p-4 text-wrap transition hover:bg-base-lighter",
                !team.notes ? "text-base-text-darker" : "",
              )}
            >
              {team.notes ? team.notes : "Tell us more about the team"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamDetailsMon({ pokemon, pokemonCount }) {
  const mon = pokemonData.find((p) => p.id === pokemon.pokemonId);
  const evTotal =
    pokemon.evHp +
    pokemon.evAtk +
    pokemon.evDef +
    pokemon.evSpa +
    pokemon.evSpd +
    pokemon.evSpe;
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-base-light p-4">
      <div className="flex w-full items-center justify-between gap-4">
        <h3 className="font-medium hover:underline">
          {pokemon.nickname ? pokemon.nickname : mon.name}
        </h3>
        <div className="flex items-center gap-4">
          {pokemonCount > 1 && (
            <Icon
              name="switch"
              color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
            />
          )}
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
      <div className="flex w-full items-stretch gap-4">
        <div className="flex shrink-0 flex-col gap-2">
          <div className="group cursor-pointer gap-2">
            <TeamSprite pokemon={pokemon.pokemonId} item={pokemon.itemId} />
            <span className="w-full overflow-x-scroll text-small text-base-text-darker group-hover:underline">
              {getFormName(mon)}
            </span>
          </div>
          <span className="w-full cursor-pointer overflow-x-scroll text-small hover:underline">
            {abilityData.find((a) => a.id === pokemon.abilityId).name}
          </span>
          <span className="w-full cursor-pointer overflow-x-scroll text-small hover:underline">
            {itemData.find((i) => i.id === pokemon.itemId).name}
          </span>
        </div>
        <div className="flex w-full min-w-0 flex-col justify-between">
          {[1, 2, 3, 4].map((n) => {
            const move = pokemon.moves.find((m) => m.slot === n);

            return <Move key={n} moveId={move?.moveId || ""} />;
          })}
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <span className="cursor-pointer rounded-lg px-2 py-1 text-small font-medium transition hover:bg-base-lighter">
              {`${natureData.find((n) => n.id === pokemon.nature).name} (${natureData.find((n) => n.id === pokemon.nature).effect})`}
            </span>
            <span className="text-small font-medium">{`EV ${evTotal}/66`}</span>
          </div>

          <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-2 rounded-lg bg-base-lighter">
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">HP</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evHp === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evHp}
              </span>
            </div>
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">Attack</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evAtk === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evAtk}
              </span>
            </div>
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">Defense</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evDef === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evDef}
              </span>
            </div>
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">Sp.Attack</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evSpa === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evSpa}
              </span>
            </div>
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">Sp.Defense</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evSpd === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evSpd}
              </span>
            </div>
            <div className="group flex cursor-text flex-col justify-center px-2">
              <p className="text-small text-base-text-darker">Speed</p>
              <span
                className={clsx(
                  "font-medium group-hover:underline",
                  pokemon.evSpe === 0 ? "text-base-text-darker" : "",
                )}
              >
                {pokemon.evSpe}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Move({ moveId }) {
  const move = moveData.find((m) => m.id === moveId);
  const styles = {
    normal: "ring-normal text-normal",
    fighting: "ring-fighting text-fighting",
    flying: "ring-flying text-flying",
    poison: "ring-poison text-poison",
    ground: "ring-ground text-ground",
    rock: "ring-rock text-rock",
    bug: "ring-bug text-bug",
    ghost: "ring-ghost text-ghost",
    steel: "ring-steel text-steel",
    fire: "ring-fire text-fire",
    water: "ring-water text-water",
    grass: "ring-grass text-grass",
    electric: "ring-electric text-electric",
    psychic: "ring-psychic text-psychic",
    ice: "ring-ice text-ice",
    dragon: "ring-dragon text-dragon",
    dark: "ring-dark text-dark",
    fairy: "ring-fairy text-fairy",
  };
  const style = styles[move?.type.toLowerCase()] || "";
  return (
    <div
      className={clsx(
        "flex w-full max-w-full min-w-0 cursor-pointer flex-col items-center overflow-hidden rounded-lg p-2 transition",
        move
          ? `ring-2 ring-inset hover:bg-base-lighter ${style}`
          : "bg-base-lighter hover:bg-base-lightest",
      )}
    >
      <span className="block w-full truncate text-start">
        {move ? move.name : "No move"}
      </span>
    </div>
  );
}
