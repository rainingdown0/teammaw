"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "./icons";
import { TeamSprite } from "./sprite";
import clsx from "clsx";
import {
  createArticle,
  getTeamData,
  getPokemonMoves,
  deleteTeam,
  updateTeamName,
  updateTeamCode,
  createTeamPokemon,
} from "@/lib/actions";
import pokemonData from "@/data/pokemon.json";
import itemData from "@/data/items.json";
import moveData from "@/data/moves.json";
import natureData from "@/data/natures.json";
import formatData from "@/data/formats.json";
import Button from "./button";

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
          "flex h-[90dvh] w-210 flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
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

export function TeamDetailsModal({ team, onClose, isDiscover }) {
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(team.name);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editedCode, setEditedCode] = useState(team.replicaId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    async function fetchData() {
      if (team.id) {
        const data = await getTeamData({ id: team.id });
        setTeamData(data);
      }
    }
    fetchData();
  }, [team.id]);
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleNameSave = () => {
    setIsEditingName(false);
    if (editedName.trim() === "") {
      setEditedName(team.name);
      return;
    }
    if (editedName !== team.name) updateTeamName(team.id, editedName);
  };
  const handleCodeSave = () => {
    setIsEditingCode(false);
    if (editedCode !== teamData.replicaId) {
      updateTeamCode(team.id, editedCode);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {/* modal background */}
      <div
        className={clsx(
          "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return;

          if (isEditingName || isEditingCode) {
            return;
          }
          handleClose();
        }}
      >
        {/* modal */}
        <div
          className={clsx(
            "flex h-[90dvh] w-210 flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all duration-150",
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-4">
              <div className="min-w-0 flex-1 font-bold">
                {/* team name */}
                {isEditingName ? (
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    maxLength={64}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNameSave();
                      } else if (e.key === "Escape") {
                        setEditedName(team.name);
                        setIsEditingName(false);
                      }
                    }}
                    className="ring-primary-main w-full rounded-lg bg-base-light p-2 font-bold text-base-text ring-2 outline-none"
                  />
                ) : (
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingName(true);
                    }}
                    className="cursor-text truncate rounded-lg p-2 transition hover:bg-base-light"
                  >
                    {editedName}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-4">
                {/* add pokemon in editor */}
                {!isDiscover && (
                  <div onClick={() => setIsSelectModalOpen(true)}>
                    <Icon
                      name="plus"
                      color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                    />
                  </div>
                )}
                {/* pokepaste */}
                <Icon
                  name="import"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
                {/* delete team in editor */}
                {!isDiscover && (
                  <div onClick={() => setIsModalOpen(true)}>
                    <Icon
                      name="trash"
                      color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                    />
                  </div>
                )}
                {/* full page in discover page */}
                {isDiscover && (
                  <Icon
                    name="expand"
                    color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                  />
                )}
                {/* close modal */}
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
                    {teamData ? `${teamData.likes.length} likes` : "Loading..."}
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
              {/* format */}
              {!isDiscover ? (
                // format editor
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 pr-3 transition hover:bg-base-light">
                  <Icon name="dropdown" color="fill-base-text" />
                  <span className="text-small font-medium">
                    {formatData.find((f) => f.id === team.format).name}
                  </span>
                </div>
              ) : (
                // display format in discover page
                <span className="text-small font-medium">
                  {formatData.find((f) => f.id === team.format).name}
                </span>
              )}
              {/* replica id */}
              <div
                onClick={() => setIsEditingCode(true)}
                className={clsx(
                  "flex cursor-text items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-base-light",
                  isEditingCode ? "bg-base-light pr-0" : "",
                )}
              >
                <span className="text-small text-base-text-darker">
                  Replica ID
                </span>
                {/* display replica id */}
                {teamData ? (
                  <>
                    {teamData.replicaId && !isEditingCode && (
                      <span className="text-small font-medium">
                        {teamData.replicaId}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-small font-medium">Loading...</span>
                )}
                {/* replica id editor */}
                {isEditingCode && (
                  <input
                    autoFocus
                    type="text"
                    maxLength={10}
                    value={editedCode}
                    onChange={(e) => {
                      const sanitized = e.target.value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .toUpperCase();
                      setEditedCode(sanitized);
                    }}
                    onBlur={handleCodeSave}
                    onKeyDown={(e) => e.key === "Enter" && handleCodeSave()}
                    className="ml-1 w-44 rounded bg-base-lighter text-center text-small font-medium text-base-text ring-1 outline-none placeholder:text-base-text-darker"
                  />
                )}
              </div>
            </div>
          </header>
          <div className="flex h-full flex-col gap-8 overflow-y-auto">
            {/* display pokemons */}
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
            {/* notes */}
            <div className="flex w-full flex-col gap-2">
              <h3 className="p-2 font-bold">Notes</h3>
              {teamData ? (
                <p
                  className={clsx(
                    "flex w-full cursor-text flex-col rounded-2xl bg-base-light p-4 text-wrap transition hover:bg-base-lighter",
                    !teamData.notes ? "text-base-text-darker" : "",
                  )}
                >
                  {teamData.notes
                    ? teamData.notes
                    : "Tell us more about the team"}
                </p>
              ) : (
                <p className="flex w-full cursor-text flex-col rounded-2xl bg-base-light p-4 text-wrap text-base-text-darker">
                  Loading...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TeamDeleteConfirmModal
          team={team}
          onClose={() => setIsModalOpen(false)}
          onDeleteSuccess={handleClose}
        />
      )}
      {isSelectModalOpen && (
        <TeamSelectItemsModal
          team={team}
          type={"pokemon"}
          onClose={() => setIsSelectModalOpen(false)}
        />
      )}
    </>
  );
}

function TeamSelectItemsModal({ team, type, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);
  const format = formatData.find((f) => f.id === team.format);
  const title = {
    pokemon: "Pokémon",
    item: "Held Item",
    move: "Moves",
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    // modal background
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      {/* modal */}
      <div
        className={clsx(
          "flex h-[90dvh] w-[40dvw] flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex flex-col gap-4 p-4">
          <h3 className="text-large font-bold">{title[type]}</h3>
          <p className="w-full font-medium text-base-text-dark">
            {format.name}
          </p>
        </header>
        <div
          className="mx-4 flex cursor-text items-center gap-4 rounded-2xl p-4 transition focus-within:bg-base-light focus-within:ring-2 focus-within:ring-accent hover:bg-base-light"
          onClick={() => inputRef.current?.focus()}
        >
          <Icon name={"search"} color={"fill-base-text-darker"} />
          <input
            className="w-full bg-transparent ring-transparent ring-offset-transparent placeholder:text-base-text-darker"
            ref={inputRef}
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-scroll p-4">
          {/* pokemon */}
          {type === "pokemon" && (
            <>
              {format.pokemon.map((mon) => (
                <div
                  key={mon}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-2xl p-4 transition hover:bg-base-lighter"
                  onClick={() => createTeamPokemon(team.id, mon)}
                >
                  <TeamSprite pokemon={mon} size={64} />
                  <p className="font-normal">
                    {pokemonData.find((p) => p.id === mon)?.name}
                    {pokemonData.find((p) => p.id === mon)?.form && (
                      <span>
                        -{pokemonData.find((p) => p.id === mon)?.form}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </>
          )}
          {/* item */}
          {type === "item" && <></>}
          {/* move */}
          {type === "move" && <></>}
        </div>
        <div className="flex w-full items-center justify-end">
          <div onClick={handleClose}>
            <Button text={"Cancel"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamDeleteConfirmModal({ team, onClose, onDeleteSuccess }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteTeam(team.id);

      setIsVisible(false);
      setTimeout(() => {
        onClose();
        if (onDeleteSuccess) onDeleteSuccess();
      }, 150);
    } catch (error) {
      console.error("Failed to delete team:", error);
      alert("Could not delete team. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
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
          "flex w-[40dvw] flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-error transition-all",
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-8 p-4">
          <h3 className="text-large font-bold">Delete team</h3>
          <p className="w-full">{`Are you sure you want to delete ${team.name}? This action cannot be undone.`}</p>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div onClick={handleClose}>
            <Button text={"Cancel"} />
          </div>
          <div
            onClick={handleDelete}
            className="flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-transparent px-6 py-4 font-semibold transition hover:bg-error"
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamDetailsMon({ pokemon, pokemonCount }) {
  function getFormName(mon) {
    const baseName = mon.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    if (!mon.form) return baseName;
    let formName = mon.form
      .toLowerCase()
      .replace("form", "")
      .trim()
      .replace(/\s+/g, "-");
    return `${baseName}-${formName}`;
  }
  const mon = pokemonData.find((p) => p.id === pokemon.pokemonId);
  const [moves, setMoves] = useState([]);
  const evTotal =
    pokemon.evHp +
    pokemon.evAtk +
    pokemon.evDef +
    pokemon.evSpa +
    pokemon.evSpd +
    pokemon.evSpe;
  useEffect(() => {
    async function fetchData() {
      if (mon) {
        const data = await getPokemonMoves(mon);
        setMoves(data);
      }
    }
    fetchData();
  }, [mon]);
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-base-light p-4">
      <div className="flex w-full items-center justify-between gap-4">
        <h3 className="font-medium hover:underline">
          {pokemon.nickname ? pokemon.nickname : mon.name}
        </h3>
        <div className="flex items-center gap-4">
          {/* move slot position */}
          {pokemonCount > 1 && (
            <Icon
              name="switch"
              color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
            />
          )}
          {/* pokepaste */}
          <Icon
            name="import"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
          {/* duplicate pokemon */}
          <Icon
            name="copy"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
          {/* delete pokemon */}
          <Icon
            name="trash"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
        </div>
      </div>
      <div className="flex w-full items-stretch gap-4">
        <div className="flex shrink-0 flex-col gap-2">
          {/* pokemon */}
          <div className="group cursor-pointer gap-2">
            <TeamSprite pokemon={pokemon.pokemonId} item={pokemon.itemId} />
            <span className="w-full overflow-x-scroll text-small text-base-text-darker group-hover:underline">
              {getFormName(mon)}
            </span>
          </div>
          {/* ability */}
          <span className="w-full cursor-pointer overflow-x-scroll text-small hover:underline">
            {pokemon.ability}
          </span>
          {/* item */}
          <span className="w-full cursor-pointer overflow-x-scroll text-small hover:underline">
            {itemData.find((i) => i.id === pokemon.itemId)
              ? itemData.find((i) => i.id === pokemon.itemId).name
              : "No item"}
          </span>
        </div>
        {/* moves */}
        <div className="flex w-full min-w-0 flex-col justify-between">
          {moves ? (
            <>
              {[1, 2, 3, 4].map((n) => {
                const move = moves.find((m) => m.slot === n);
                return <Move key={n} moveId={move?.moveId || ""} />;
              })}
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            {/* nature */}
            <span className="cursor-pointer rounded-lg px-2 py-1 text-small font-medium transition hover:bg-base-lighter">
              {`${natureData.find((n) => n.id === pokemon.nature).name} (${natureData.find((n) => n.id === pokemon.nature).effect})`}
            </span>
            {/* ev total */}
            <span className="text-small font-medium">{`EV ${evTotal}/66`}</span>
          </div>
          {/* ev */}
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

export function Modal({ title, content, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
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
          "flex w-[40dvw] flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col gap-8 p-4">
          <h3 className="text-large font-bold">{title}</h3>
          <p className="w-full">{content}</p>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div onClick={handleClose}>
            <Button text={"Cancel"} />
          </div>
        </div>
      </div>
    </div>
  );
}
