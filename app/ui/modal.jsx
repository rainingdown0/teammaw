"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  changeTeamPokemon,
  updateTeamPokemon,
  deleteTeamPokemon,
  updateTeamPokemonEv,
} from "@/lib/actions";
import pokemonData from "@/data/pokemon.json";
import moveData from "@/data/moves.json";
import learnsetData from "@/data/learnsets.json";
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
            className="flex w-full items-center rounded-2xl p-4 text-large font-semibold transition placeholder:text-base-text-darker hover:bg-base-light focus:bg-base-light"
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
        if (data?.replicaId) {
          setEditedCode(data.replicaId);
        }
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
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleNameSave = async () => {
    setIsEditingName(false);
    if (editedName.trim() === "") {
      setEditedName(team.name);
      return;
    }
    if (editedName !== team.name) {
      try {
        const result = await updateTeamName(team.id, editedName);
        if (!result?.success) throw new Error("Server failed to update");
      } catch (error) {
        console.error("Failed:", error);
        setEditedName(team.name);
        alert("Failed to save team name. Please try again.");
      }
    }
  };
  const handleCodeSave = async () => {
    setIsEditingCode(false);
    if (teamData && editedCode !== teamData.replicaId) {
      setTeamData((prev) => (prev ? { ...prev, replicaId: editedCode } : null));
      await updateTeamCode(team.id, editedCode);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (team.id) {
        const data = await getTeamData({ id: team.id });
        setTeamData(data);
        if (data?.replicaId) {
          setEditedCode(data.replicaId);
        }
      }
    }
    fetchData();
  }, [team.id]);
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
              <div className="min-w-0 flex-1 font-semibold">
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
                    className="ring-primary-main w-full rounded-lg bg-base-light p-2 text-base-text ring-2 outline-none"
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
                {!isDiscover && team.pokemon.length < 6 && (
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
                // format selector in editor
                <DropDown
                  type={"format"}
                  current={formatData.find((f) => f.id === team.format).name}
                  onSelect={null}
                />
              ) : (
                // <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 pr-3 transition hover:bg-base-light">
                //   <Icon name="dropdown" color="fill-base-text" />
                //   <span className="text-small font-medium">
                //     {formatData.find((f) => f.id === team.format).name}
                //   </span>
                // </div>
                // display format in discover page
                <span className="text-small font-medium">
                  {formatData.find((f) => f.id === team.format).name}
                </span>
              )}
              {/* replica id */}
              <div
                onClick={() => {
                  setEditedCode(teamData?.replicaId || "");
                  setIsEditingCode(true);
                }}
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
                [...team.pokemon]
                  .sort((a, b) => a.slot - b.slot)
                  .map((pokemon) => (
                    <TeamDetailsMon
                      key={pokemon.id}
                      team={team}
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
      {isModalOpen &&
        createPortal(
          <TeamDeleteConfirmModal
            team={team}
            onClose={() => setIsModalOpen(false)}
            onDeleteSuccess={handleClose}
          />,
          document.body,
        )}
      {isSelectModalOpen &&
        createPortal(
          <TeamSelectItemsModal
            team={team}
            type={"pokemon"}
            onClose={() => setIsSelectModalOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

function TeamDetailsMon({ team, pokemon, pokemonCount, isDiscover }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  function openModal(type) {
    setModalType(type);
    setIsModalOpen(true);
  }
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
  const handleNatureSelect = async (nature) =>
    await updateTeamPokemon("nature", pokemon, nature);
  const handleAbilitySelect = async (ability) =>
    await updateTeamPokemon("ability", pokemon, ability);
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
    <>
      <div className="flex w-full flex-col gap-4 rounded-2xl bg-base-light p-4">
        <div className="flex w-full items-center justify-between gap-4">
          <h3 className="font-medium hover:underline">
            {pokemon.nickname ? pokemon.nickname : mon.name}
          </h3>
          <div className="flex items-center gap-4">
            {/* move slot position in editor */}
            {!isDiscover && pokemonCount > 1 && (
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
            {/* delete pokemon in editor */}
            {!isDiscover && (
              <div onClick={() => deleteTeamPokemon(pokemon)}>
                <Icon
                  name="trash"
                  color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full items-stretch gap-4">
          <div className="flex shrink-0 flex-col gap-2">
            {/* pokemon */}
            <div
              className={clsx(
                "group gap-2",
                !isDiscover ? "cursor-pointer" : "",
              )}
              onClick={() => (!isDiscover ? openModal("pokemonChange") : null)}
            >
              <TeamSprite pokemon={pokemon.pokemonId} item={pokemon.item} />
              <span
                className={clsx(
                  "w-full overflow-x-scroll text-small text-base-text-darker",
                  !isDiscover ? "group-hover:underline" : "",
                )}
              >
                {getFormName(mon)}
              </span>
            </div>
            {/* ability */}
            {/* ability selector in editor */}
            <DropDown
              type={"ability"}
              current={pokemon.ability}
              pokemon={pokemon}
              onSelect={handleAbilitySelect}
            />
            {/* display ability in discover */}
            {isDiscover && (
              <span className={"w-full overflow-x-scroll text-small"}>
                {pokemon.ability}
              </span>
            )}
            {/* item */}
            <span
              className={clsx(
                "w-full overflow-x-scroll text-small",
                !isDiscover ? "cursor-pointer hover:underline" : "",
                !pokemon.item ? "text-base-text-darker" : "",
              )}
              onClick={() => (!isDiscover ? openModal("item") : null)}
            >
              {pokemon.item ? pokemon.item : "No item"}
            </span>
          </div>
          {/* moves */}
          <div className="flex w-full min-w-0 flex-col justify-between">
            {moves ? (
              <>
                {[1, 2, 3, 4].map((n) => {
                  const move = moves.find((m) => m.slot === n);
                  return (
                    <div
                      key={n}
                      onClick={() => (!isDiscover ? openModal("move") : null)}
                    >
                      <Move
                        moveId={move?.moveId || ""}
                        isDiscover={isDiscover}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <div className="flex min-w-64 flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              {/* nature */}
              {/* nature selector in editor */}
              {!isDiscover && (
                <DropDown
                  type={"nature"}
                  current={natureData.find((n) => n.id === pokemon.nature).name}
                  onSelect={handleNatureSelect}
                />
              )}
              {/* display nature in discover */}
              {isDiscover && (
                <span className="items-center justify-between px-2 py-1 text-small font-medium">
                  {natureData.find((n) => n.id === pokemon.nature).name}
                </span>
              )}
              {/* ev total */}
              <span className="text-small font-medium">{`EV ${evTotal}/66`}</span>
            </div>
            {/* ev */}
            <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-2 rounded-lg bg-base-lighter">
              <Ev pokemon={pokemon} type={"HP"} isDiscover={isDiscover} />
              <Ev pokemon={pokemon} type={"Atk"} isDiscover={isDiscover} />
              <Ev pokemon={pokemon} type={"Def"} isDiscover={isDiscover} />
              <Ev pokemon={pokemon} type={"SpA"} isDiscover={isDiscover} />
              <Ev pokemon={pokemon} type={"SpD"} isDiscover={isDiscover} />
              <Ev pokemon={pokemon} type={"Spe"} isDiscover={isDiscover} />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen &&
        createPortal(
          <TeamSelectItemsModal
            team={team}
            pokemon={pokemon}
            type={modalType}
            onClose={() => setIsModalOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

function TeamSelectItemsModal({
  team,
  pokemon,
  type,
  onClose,
  onCreateSuccess,
  onChangeSuccess,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const format = formatData.find((f) => f.id === team.format);
  const title = {
    pokemon: "Pokémon",
    pokemonChange: "Pokémon",
    item: "Held Item",
    move: "Moves",
  };
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleCreate = async (e, mon) => {
    e.stopPropagation();
    try {
      await createTeamPokemon(team.id, mon);
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        if (onCreateSuccess) onCreateSuccess();
      }, 150);
    } catch (error) {
      console.error("Failed to add Pokémon:", error);
      alert("Could not add Pokémon. Please try again.");
    }
  };
  const handleChange = async (e, mon, pokemonId) => {
    e.stopPropagation();
    try {
      await changeTeamPokemon(mon, pokemonId);
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        if (onChangeSuccess) onChangeSuccess();
      }, 150);
    } catch (error) {
      console.error("Failed to change Pokémon:", error);
      alert("Could not change Pokémon. Please try again.");
    }
  };
  const handleItemUpdate = async (e, mon, item) => {
    e.stopPropagation();
    try {
      await updateTeamPokemon("item", mon, item);
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        if (onChangeSuccess) onChangeSuccess();
      }, 150);
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Could not update item. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      inputRef.current?.focus();
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  const pokemonList = format.pokemon
    .filter((mon) => {
      const p = pokemonData.find((data) => data.id === mon);
      if (!p) return false;
      const fullName = `${p.name}${p.form ? `-${p.form}` : ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .map((mon) => {
      const p = pokemonData.find((data) => data.id === mon);
      return {
        id: mon,
        types: p.types,
      };
    })
    .sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
  const itemList = format.items
    .filter((item) => {
      return item.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      return a.localeCompare(b);
    });
  const moveList =
    pokemon?.pokemonId && learnsetData[pokemon.pokemonId]
      ? learnsetData[pokemon.pokemonId]
          .map((moveId) => {
            const match = moveData.find((m) => m.id === moveId);
            return match ? match : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];
  const styles = {
    Normal: "text-normal",
    Fighting: "text-fighting",
    Flying: "text-flying",
    Poison: "text-poison",
    Ground: "text-ground",
    Rock: "text-rock",
    Bug: "text-bug",
    Ghost: "text-ghost",
    Steel: "text-steel",
    Fire: "text-fire",
    Water: "text-water",
    Grass: "text-grass",
    Electric: "text-electric",
    Psychic: "text-psychic",
    Ice: "text-ice",
    Dragon: "text-dragon",
    Dark: "text-dark",
    Fairy: "text-fairy",
  };

  return (
    // modal background
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-base-background/80 backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      {/* modal */}
      <div
        className={clsx(
          "flex h-[90dvh] w-[40dvw] min-w-lg flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
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
        {/* search bar */}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-scroll p-4">
          {/* pokemon */}
          {(type === "pokemon" || type === "pokemonChange") && (
            <>
              {pokemonList.map((mon) => (
                <div
                  key={mon.id}
                  className="flex w-full cursor-pointer items-center justify-between gap-8 rounded-2xl p-4 transition hover:bg-base-light"
                  onClick={(e) => {
                    if (type === "pokemon") handleCreate(e, mon.id);
                    else if (type === "pokemonChange")
                      handleChange(e, pokemon, mon.id);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <TeamSprite pokemon={mon.id} size={64} />
                    <p className="font-normal">
                      {pokemonData.find((p) => p.id === mon.id)?.name}
                      {pokemonData.find((p) => p.id === mon.id)?.form && (
                        <span>
                          -{pokemonData.find((p) => p.id === mon.id)?.form}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex w-fit gap-2">
                    {mon.types.map((type) => (
                      <span key={type} className={`${styles[type]}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {pokemonList.length === 0 && (
                <p className="flex h-full items-center justify-center text-base-text-darker">
                  No results
                </p>
              )}
            </>
          )}
          {/* item */}
          {type === "item" && (
            <>
              {itemList.map((item) => (
                <div
                  key={item}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-2xl p-4 transition hover:bg-base-light"
                  onClick={(e) => handleItemUpdate(e, pokemon, item)}
                >
                  {/* <ItemSprite item={item} /> */}
                  <p className="font-normal">{item}</p>
                </div>
              ))}
            </>
          )}
          {/* move */}
          {type === "move" && (
            <>
              {moveList.map((move) => (
                <div
                  key={move.id}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl p-4 transition hover:bg-base-light"
                  onClick={(e) => null}
                >
                  {/* <ItemSprite item={item} /> */}
                  <p className="font-normal">{move.name}</p>
                  <span className={`${styles[move.type]}`}>{move.type}</span>
                </div>
              ))}
            </>
          )}
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
        "fixed inset-0 z-50 flex items-center justify-center bg-base-background/80 backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      <div
        className={clsx(
          "flex w-[40dvw] min-w-lg flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-error transition-all",
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

function Move({ moveId, isDiscover }) {
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
        move ? "ring-2 ring-inset" : "bg-base-lighter text-base-text-darker",
        isDiscover && move
          ? `cursor-pointer hover:bg-base-lighter ${style}`
          : "",
        isDiscover && !move ? "hover:bg-base-lightest" : "",
      )}
    >
      <span className="block w-full truncate text-start">
        {move ? move.name : "No move"}
      </span>
    </div>
  );
}

export function Ev({ pokemon, type, isDiscover, onEvSave }) {
  const evValues = {
    HP: pokemon.evHp || 0,
    Atk: pokemon.evAtk || 0,
    Def: pokemon.evDef || 0,
    SpA: pokemon.evSpa || 0,
    SpD: pokemon.evSpd || 0,
    Spe: pokemon.evSpe || 0,
  };
  const currentEv = evValues[type];
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentEv.toString());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const calculateMaxAllowed = () => {
    const totalEvs = Object.values(evValues).reduce((sum, val) => sum + val, 0);
    const otherEvsTotal = totalEvs - currentEv;

    return Math.min(32, 66 - otherEvsTotal);
  };
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (rawValue === "") {
      setEditValue("");
      return;
    }
    const numValue = parseInt(rawValue, 10);
    const maxAllowed = calculateMaxAllowed();
    if (numValue > maxAllowed) {
      setEditValue(maxAllowed.toString());
    } else {
      setEditValue(numValue.toString());
    }
  };
  const handleSave = async () => {
    setIsEditing(false);
    let finalValue = editValue === "" ? 0 : parseInt(editValue, 10);
    if (finalValue !== currentEv) {
      try {
        updateTeamPokemonEv(type, pokemon, finalValue);
        if (onEvSave) {
          await onEvSave(type, finalValue);
        }
      } catch (error) {
        console.error("Failed to save EV:", error);
        setEditValue(currentEv.toString());
      }
    } else {
      setEditValue(finalValue.toString());
    }
  };

  return (
    <div
      onClick={() => {
        if (!isDiscover) {
          setEditValue(currentEv.toString());
          setIsEditing(true);
        }
      }}
      className={clsx(
        "flex flex-col justify-center px-2 transition",
        !isDiscover ? "group cursor-text rounded hover:bg-base-lighter" : "",
      )}
    >
      <p className="text-small text-base-text-darker">{type}</p>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditValue(currentEv.toString());
              setIsEditing(false);
            }
          }}
          className="w-full rounded-lg border-none border-transparent bg-base-lightest text-left font-medium text-base-text ring-1"
        />
      ) : (
        <span
          className={clsx(
            "font-medium",
            currentEv === 0 ? "text-base-text-darker" : "",
            !isDiscover ? "group-hover:underline" : "",
          )}
        >
          {currentEv}
        </span>
      )}
    </div>
  );
}

function DropDown({ type, current, pokemon, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let options = [];
  if (type === "ability") {
    const mon = pokemonData.find((p) => p.id === pokemon.pokemonId);
    options = mon.abilities.map((a) => ({ id: a, name: a, value: a }));
  } else if (type === "format") {
    options = formatData.map((f) => ({ id: f.id, name: f.name, value: f.id }));
  } else if (type === "nature") {
    options = natureData.map((n) => ({ id: n.id, name: n.name, value: n.id }));
  }

  return (
    <div ref={dropdownRef} className="relative inline-block w-fit text-left">
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex w-full cursor-pointer items-center whitespace-nowrap focus:outline-none",
          type === "ability"
            ? "text-small font-normal hover:underline focus:underline"
            : "",
          type === "format"
            ? "rounded-lg px-2 py-1 text-small font-medium ring-1 ring-transparent transition hover:bg-base-light focus:bg-base-light focus:ring-accent"
            : "",
          type === "nature"
            ? "rounded-lg px-2 py-1 text-small font-medium ring-1 ring-transparent transition hover:bg-base-lighter focus:bg-base-lighter focus:ring-accent"
            : "",
        )}
      >
        <span>{current}</span>
      </button>

      {/* Dropdown Menu List */}
      {isOpen && (
        <ul className="absolute left-0 z-50 mt-2 max-h-64 w-max min-w-full overflow-y-auto overscroll-contain rounded-lg bg-base-light shadow-xl ring-1 ring-base-lightest focus:outline-none">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full cursor-pointer p-4 py-3 text-small whitespace-nowrap transition hover:bg-base-lighter",
                current === option.name
                  ? "text-base-text"
                  : "text-base-text-darker hover:text-base-text",
              )}
            >
              {option.name}
            </li>
          ))}

          {options.length === 0 && (
            <p className="p-3 text-center text-small whitespace-nowrap text-base-text-darker">
              No options available
            </p>
          )}
        </ul>
      )}
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
        "fixed inset-0 z-50 flex items-center justify-center bg-base-background/80 backdrop-blur-sm transition",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      <div
        className={clsx(
          "flex w-[40dvw] min-w-lg flex-col gap-4 overflow-hidden rounded-2xl bg-base-base p-4 ring-2 ring-base-light transition-all",
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
