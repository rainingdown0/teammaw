"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "./icons";
import { TeamSprite } from "./sprite";
import clsx from "clsx";
import { deleteTeam, updateTeamName, createArticle } from "@/lib/actions";
import pokemonData from "@/data/pokemon.json";
import abilityData from "@/data/abilities.json";
import itemData from "@/data/items.json";
import moveData from "@/data/moves.json";
import natureData from "@/data/natures.json";
import formatData from "@/data/formats.json";
import Button from "./button";
import { redirect } from "next/navigation";

export function NewsCreateModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.target);
    const result = await createArticle(formData);

    setIsPending(false);

    if (result?.error) {
      alert(result.error);
    } else {
      handleClose();
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={clsx(
          "flex h-[90dvh] w-210 flex-col gap-8 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="w-full">
          <input
            className="flex w-full items-center rounded-2xl p-4 text-large font-bold transition placeholder:text-base-text-darker hover:bg-base-light focus:bg-base-light"
            name="title"
            type="text"
            maxLength={150}
            placeholder="Title"
            required
          />
        </header>
        <div className="h-full w-full">
          <textarea
            className="h-full w-full resize-none rounded-2xl p-4 text-start transition outline-none placeholder:text-base-text-darker hover:bg-base-light focus:bg-base-light"
            name="content"
            placeholder="Content"
            required
          />
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div onClick={handleClose}>
            <Button text={"Cancel"} />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-4 font-semibold text-primary-text transition hover:bg-primary-light disabled:bg-primary-dark disabled:text-primary-lighter"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}

export function TeamDetailsModal({ team, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(team.name);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleNameSave = () => {
    setIsEditing(false);
    if (editedName.trim() === "") {
      setEditedName(team.name);
      return;
    }
    if (editedName !== team.name) {
      updateTeamName(team.id, editedName);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setEditedName(team.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      <div
        className={clsx(
          "flex h-[90dvh] w-210 flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-4">
            <div className="min-w-0 flex-1 font-bold">
              {isEditing ? (
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  maxLength={64}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyDown}
                  className="ring-primary-main w-full rounded-lg bg-base-light p-2 font-bold text-base-text ring-2 outline-none"
                />
              ) : (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="cursor-text truncate rounded-lg p-2 transition hover:bg-base-light"
                >
                  {editedName}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-4">
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
                  e.stopPropagation();
                  deleteTeam(team.id);
                }}
              >
                <Icon
                  name="trash"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
              </div>
              <div onClick={handleClose}>
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
