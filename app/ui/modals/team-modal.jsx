"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Icon from "../icons";
import { TeamSprite } from "../sprite";
import clsx from "clsx";
import { deleteTeam, updateTeam } from "@/lib/actions/team-actions";
import pokemonData from "@/data/pokemon.json";
import itemData from "@/data/items.json";
import abilityData from "@/data/abilities.json";
import moveData from "@/data/moves.json";
import learnsetData from "@/data/learnsets.json";
import natureData from "@/data/natures.json";
import formatData from "@/data/formats.json";
import Button from "../button";

function SaveChangesConfirmModal({ onSave, onDiscard, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleSave = () => {
    setIsVisible(false);
    setTimeout(onSave, 150);
  };
  const handleDiscard = () => {
    setIsVisible(false);
    setTimeout(onDiscard, 150);
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
      >
        <div className="flex flex-col gap-8 p-4">
          <h3 className="text-large font-bold">Save Changes</h3>
          <p className="w-full">
            You have unsaved changes. Would you like to save them before
            closing?
          </p>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div onClick={handleDiscard}>
            <Button text={"Discard"} />
          </div>
          <div
            onClick={handleSave}
            className="flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-4 font-semibold text-primary-text transition hover:bg-primary-light"
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamDetailsModal({ team, onClose, isDiscover }) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayTeam, setDisplayTeam] = useState(team);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(team.name);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editedCode, setEditedCode] = useState(team.replicaId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTeam] = useState(team);
  const inputRef = useRef(null);
  const isTeamLegal = checkTeamLegality(displayTeam);

  // 1. AUTO-FOCUS INPUT
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  // 2. ANIMATION TRIGGER
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // 3. CLOSE HANDLER
  const handleClose = () => {
    if (hasChanges) {
      setIsSaveConfirmationOpen(true);
    } else {
      setIsVisible(false);
      setTimeout(onClose, 150);
    }
  };

  // 4. DISCARD HANDLER
  const handleDiscardChanges = () => {
    setIsSaveConfirmationOpen(false);
    setIsVisible(false);
    setEditedName(team.name);
    setEditedCode(team.replicaId || "");
    setDisplayTeam(originalTeam);
    setTimeout(onClose, 150);
  };

  // 5. BATCH SAVE HANDLER
  const handleSaveChanges = async () => {
    setIsSaveConfirmationOpen(false);

    try {
      const payload = {
        name: editedName,
        replicaId: editedCode,
        pokemon: displayTeam.pokemon,
        isLegal: isTeamLegal, // <-- Uses the pure variable
      };
      const response = await updateTeam(team.id, payload);
      if (!response.success) throw new Error(response.error);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save your team. Please try again.");
      return;
    }
    setHasChanges(false);
    if (isSaveConfirmationOpen) {
      setIsVisible(false);
      setTimeout(onClose, 150);
    }
  };

  // 6. INPUT BLUR HANDLERS
  const handleNameSave = () => {
    setIsEditingName(false);
    if (editedName.trim() === "") {
      setEditedName(team.name);
      return;
    }
    if (editedName !== team.name) {
      setHasChanges(true);
    }
  };

  const handleCodeSave = () => {
    setIsEditingCode(false);
    if (editedCode !== team.replicaId) {
      setHasChanges(true);
    }
  };

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
          if (isEditingName || isEditingCode) return;
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
              {/* team name */}
              <div className="min-w-0 flex-1 font-semibold">
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
                      if (e.key === "Enter") handleNameSave();
                      else if (e.key === "Escape") {
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
              {/* buttons */}
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
                {/* save changes in editor */}
                {!isDiscover && hasChanges && (
                  <div onClick={handleSaveChanges}>
                    <Icon
                      name="save"
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
                {/* fullscreen in discover */}
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
              {/* team info */}
              <div className="flex w-fit items-center gap-8 text-small font-medium">
                {/* likes if public */}
                {team.isPublic && (
                  <span className="whitespace-nowrap">
                    {team.likes ? `${team.likes.length} likes` : "0 likes"}
                  </span>
                )}
                {/* visibility */}
                <span>{team.isPublic ? "Public" : "Private"}</span>
                {/* validation */}
                <span
                  className={clsx(
                    !isTeamLegal
                      ? "cursor-help text-primary-light hover:underline"
                      : "",
                  )}
                >
                  {isTeamLegal ? "Validated" : "Invalidated"}{" "}
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
                // display format in discover
                <span className="text-small font-medium">
                  {formatData.find((f) => f.id === team.format).name}
                </span>
              )}
              {/* replica id */}
              <div
                onClick={() => {
                  if (isDiscover) return;
                  setEditedCode(team.replicaId || "");
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
                {team.replicaId && !isEditingCode && (
                  <span className="text-small font-medium">
                    {team.replicaId}
                  </span>
                )}
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
            <div className="flex w-full flex-col gap-4">
              {displayTeam.pokemon ? (
                [...displayTeam.pokemon]
                  .sort((a, b) => a.slot - b.slot)
                  .map((pokemon) => (
                    <TeamDetailsMon
                      key={pokemon.id}
                      team={displayTeam}
                      pokemon={pokemon}
                      pokemonCount={displayTeam.pokemon.length}
                      isDiscover={isDiscover}
                      onNicknameChange={(nickname) => {
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id ? { ...p, nickname } : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onAbilityChange={(ability) => {
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id ? { ...p, ability } : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onNatureChange={(nature) => {
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id ? { ...p, nature } : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onItemChange={(item) => {
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id ? { ...p, item } : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onEvChange={(evType, evValue) => {
                        const typeMapping = {
                          HP: "Hp",
                          Atk: "Atk",
                          Def: "Def",
                          SpA: "Spa",
                          SpD: "Spd",
                          Spe: "Spe",
                        };
                        const normalizedType = typeMapping[evType] || evType;
                        const evKey = `ev${normalizedType}`;
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id
                              ? { ...p, [evKey]: Number(evValue) }
                              : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onPokemonDelete={() => {
                        setDisplayTeam((prev) => {
                          const remainingPokemon = prev.pokemon.filter(
                            (p) => p.id !== pokemon.id,
                          );
                          const sortedRemaining = remainingPokemon.sort(
                            (a, b) => a.slot - b.slot,
                          );
                          const reindexedPokemon = sortedRemaining.map(
                            (p, index) => ({ ...p, slot: index + 1 }),
                          );
                          return { ...prev, pokemon: reindexedPokemon };
                        });
                        setHasChanges(true);
                      }}
                      onPokemonChange={(newPokemonId) => {
                        const monInfo = pokemonData.find(
                          (p) => p.id === newPokemonId,
                        );
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id
                              ? {
                                  ...p,
                                  pokemonId: newPokemonId,
                                  nickname: monInfo ? monInfo.name : p.nickname,
                                  ability: monInfo?.abilities[0] || "",
                                  nature: "hardy",
                                  item: "",
                                  moves: [],
                                  evHp: 0,
                                  evAtk: 0,
                                  evDef: 0,
                                  evSpa: 0,
                                  evSpd: 0,
                                  evSpe: 0,
                                }
                              : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
                      onSlotChange={(newSlot) => {
                        setDisplayTeam((prev) => {
                          const roster = [...prev.pokemon].sort(
                            (a, b) => a.slot - b.slot,
                          );
                          const oldIndex = roster.findIndex(
                            (p) => p.id === pokemon.id,
                          );
                          const [movedPokemon] = roster.splice(oldIndex, 1);
                          roster.splice(newSlot - 1, 0, movedPokemon);
                          const reindexedRoster = roster.map((p, index) => ({
                            ...p,
                            slot: index + 1,
                          }));
                          return { ...prev, pokemon: reindexedRoster };
                        });
                        setHasChanges(true);
                      }}
                      onMoveChange={(newMoves) => {
                        setDisplayTeam((prev) => ({
                          ...prev,
                          pokemon: prev.pokemon.map((p) =>
                            p.id === pokemon.id ? { ...p, moves: newMoves } : p,
                          ),
                        }));
                        setHasChanges(true);
                      }}
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
            team={displayTeam}
            type={"pokemon"}
            onClose={() => setIsSelectModalOpen(false)}
            onCreateSuccess={(pokemonId) => {
              const mon = pokemonData.find((p) => p.id === pokemonId);
              const newPokemon = {
                id: `temp-${Date.now()}`,
                pokemonId,
                nickname: mon.name,
                ability: mon.abilities[0],
                nature: "hardy",
                item: "",
                slot: displayTeam.pokemon.length + 1,
                evHp: 0,
                evAtk: 0,
                evDef: 0,
                evSpa: 0,
                evSpd: 0,
                evSpe: 0,
              };
              setDisplayTeam((prev) => ({
                ...prev,
                pokemon: [...prev.pokemon, newPokemon],
              }));
              setHasChanges(true);
            }}
          />,
          document.body,
        )}
      {isSaveConfirmationOpen &&
        createPortal(
          <SaveChangesConfirmModal
            onSave={handleSaveChanges}
            onDiscard={handleDiscardChanges}
            onClose={() => setIsSaveConfirmationOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

function TeamDetailsMon({
  team,
  pokemon,
  pokemonCount,
  isDiscover,
  onNicknameChange,
  onAbilityChange,
  onNatureChange,
  onItemChange,
  onEvChange,
  onPokemonDelete,
  onPokemonChange,
  onSlotChange,
  onMoveChange,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [activeMoveSlot, setActiveMoveSlot] = useState(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const mon = pokemonData.find((p) => p.id === pokemon.pokemonId);
  const currentDefaultName = pokemon.nickname || mon.name;

  const [prevName, setPrevName] = useState(currentDefaultName);
  const [editedNickname, setEditedNickname] = useState(currentDefaultName);
  const nicknameInputRef = useRef(null);

  // LIVE-SYNC STATE DURING RENDER: Detects changes instantly without useEffect
  if (currentDefaultName !== prevName) {
    setPrevName(currentDefaultName);
    setEditedNickname(currentDefaultName);
  }

  // Auto-focus input when editing
  useEffect(() => {
    if (isEditingNickname && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
      nicknameInputRef.current.select();
    }
  }, [isEditingNickname]);

  // Handle saving the nickname
  const handleNicknameSave = () => {
    setIsEditingNickname(false);
    const finalName =
      editedNickname.trim() === "" ? mon.name : editedNickname.trim();
    setEditedNickname(finalName);
    if (finalName !== pokemon.nickname) {
      if (onNicknameChange) onNicknameChange(finalName);
    }
  };

  function openModal(type, slot = null) {
    setModalType(type);
    setActiveMoveSlot(slot);
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

  const handleNatureSelect = (nature) => {
    if (onNatureChange) onNatureChange(nature);
  };
  const handleAbilitySelect = (ability) => {
    if (onAbilityChange) onAbilityChange(ability);
  };

  const moves = pokemon.moves || [];
  const itemInfo = itemData.find((i) => i.id === pokemon.item);
  const itemDisplayName = itemInfo ? itemInfo.name : pokemon.item;
  const abilityInfo = abilityData.find((a) => a.id === pokemon.ability);
  const abilityDisplayName = abilityInfo ? abilityInfo.name : pokemon.ability;
  const evTotal =
    pokemon.evHp +
    pokemon.evAtk +
    pokemon.evDef +
    pokemon.evSpa +
    pokemon.evSpd +
    pokemon.evSpe;

  const pokemonLearnsetIds = learnsetData[pokemon.pokemonId] || [];
  const availableMoves = pokemonLearnsetIds.map((moveId) => {
    const mData = moveData.find((m) => m.id === moveId);
    return { id: moveId, name: mData?.name || moveId };
  });

  return (
    <>
      <div className="flex w-full flex-col gap-4 rounded-2xl bg-base-light p-4">
        <div className="flex w-full items-center justify-between gap-4">
          {/* pokemon name */}
          <div className="min-w-0 flex-1">
            {isEditingNickname && !isDiscover ? (
              <input
                ref={nicknameInputRef}
                type="text"
                maxLength={24}
                value={editedNickname}
                onChange={(e) => setEditedNickname(e.target.value)}
                onBlur={handleNicknameSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNicknameSave();
                  else if (e.key === "Escape") {
                    setEditedNickname(pokemon.nickname || mon.name);
                    setIsEditingNickname(false);
                  }
                }}
                className="ring-primary-main w-full max-w-64 rounded-lg bg-base-lighter font-medium text-base-text ring-2 outline-none"
              />
            ) : (
              <h3
                onClick={(e) => {
                  if (isDiscover) return;
                  e.stopPropagation();
                  setIsEditingNickname(true);
                }}
                className={clsx(
                  "max-w-64 truncate rounded-lg font-medium transition",
                  !isDiscover ? "cursor-text hover:underline" : "",
                )}
              >
                {pokemon.nickname ? pokemon.nickname : mon.name}
              </h3>
            )}
          </div>
          {/* buttons */}
          <div className="flex items-center gap-4">
            {/* move position in editor */}
            {!isDiscover && pokemonCount > 1 && (
              <DropDown
                type="slot"
                current={pokemon.slot}
                pokemonCount={pokemonCount}
                onSelect={(newSlot) => {
                  if (onSlotChange) onSlotChange(newSlot);
                }}
              />
            )}
            {/* pokepaste */}
            <Icon
              name="import"
              color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
            />
            {/* delete pokemon in editor */}
            {!isDiscover && (
              <div onClick={onPokemonDelete}>
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
            <div
              className={clsx(
                "group gap-2",
                !isDiscover ? "cursor-pointer" : "",
              )}
              onClick={() => (!isDiscover ? openModal("pokemonChange") : null)}
            >
              {/* pokemon sprite */}
              <TeamSprite pokemon={pokemon.pokemonId} item={pokemon.item} />
              {/* pokemon species */}
              <span
                className={clsx(
                  "w-full overflow-x-scroll text-small text-base-text-darker",
                  !isDiscover ? "group-hover:underline" : "",
                )}
              >
                {getFormName(mon)}
              </span>
            </div>
            <>
              {/* ability selector in editor */}
              {!isDiscover && (
                <DropDown
                  type={"ability"}
                  current={abilityDisplayName} // Changed to display name
                  pokemon={pokemon}
                  onSelect={handleAbilitySelect}
                />
              )}
              {/* display ability in discover */}
              {isDiscover && (
                <span className={"w-full overflow-x-scroll text-small"}>
                  {abilityDisplayName}
                </span>
              )}
            </>
            {/* item */}
            <span
              className={clsx(
                "w-full overflow-x-scroll text-small",
                !isDiscover ? "cursor-pointer hover:underline" : "",
                !pokemon.item ? "text-base-text-darker" : "",
              )}
              onClick={() => (!isDiscover ? openModal("item") : null)}
            >
              {pokemon.item ? itemDisplayName : "No item"}
            </span>
          </div>
          <>
            {moves ? (
              <div className="flex w-full min-w-0 flex-col justify-between">
                {[1, 2, 3, 4].map((n) => {
                  const move = moves.find((m) => m.slot === n);
                  return (
                    <div
                      key={n}
                      onClick={() =>
                        !isDiscover ? openModal("move", n) : null
                      }
                    >
                      <Move
                        moveId={move?.moveId || ""}
                        isDiscover={isDiscover}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <span>Loading...</span>
            )}
          </>
          <div className="flex min-w-64 flex-col gap-2">
            <div className="flex w-full items-center justify-between">
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
              {/* total EV */}
              <span className="text-small font-medium">{`EV ${evTotal}/66`}</span>
            </div>
            {/* EV spread */}
            <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-2 rounded-lg bg-base-lighter">
              <Ev
                pokemon={pokemon}
                type={"HP"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
              <Ev
                pokemon={pokemon}
                type={"Atk"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
              <Ev
                pokemon={pokemon}
                type={"Def"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
              <Ev
                pokemon={pokemon}
                type={"SpA"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
              <Ev
                pokemon={pokemon}
                type={"SpD"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
              <Ev
                pokemon={pokemon}
                type={"Spe"}
                isDiscover={isDiscover}
                onEvChange={onEvChange}
              />
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
            availableMoves={availableMoves}
            activeSlot={activeMoveSlot}
            hasExistingMove={
              modalType === "move" &&
              !!moves.find((m) => m.slot === activeMoveSlot)
            }
            onForgetMove={() => {
              const packedMoves = moves
                .filter((m) => m.slot !== activeMoveSlot)
                .sort((a, b) => a.slot - b.slot)
                .map((m, index) => ({ ...m, slot: index + 1 }));

              if (onMoveChange) onMoveChange(packedMoves);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
            onChangeSuccess={(selectedData) => {
              if (modalType === "item" && onItemChange) {
                onItemChange(selectedData);
              } else if (modalType === "pokemonChange" && onPokemonChange) {
                onPokemonChange(selectedData);
              } else if (modalType === "move" && onMoveChange) {
                const updatedMoves = [...moves];
                const existingIdx = updatedMoves.findIndex(
                  (m) => m.slot === activeMoveSlot,
                );

                if (existingIdx > -1) {
                  updatedMoves[existingIdx].moveId = selectedData;
                } else {
                  updatedMoves.push({
                    moveId: selectedData,
                    slot: activeMoveSlot,
                  });
                }

                const packedMoves = updatedMoves
                  .filter((m) => m && m.moveId)
                  .sort((a, b) => a.slot - b.slot)
                  .map((m, index) => ({ ...m, slot: index + 1 }));

                onMoveChange(packedMoves);
              }
              setIsModalOpen(false);
            }}
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
  hasExistingMove,
  onForgetMove,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const format = formatData.find((f) => f.id === team.format);
  const title = {
    pokemon: "Pokémon",
    pokemonChange: "Pokémon",
    item: `Held Item for ${pokemon.nickname}`,
    move: `Moves for ${pokemon.nickname}`,
  };
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const handleCreate = (e, mon) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (onCreateSuccess) onCreateSuccess(mon);
    }, 150);
  };
  const handleChange = (e, pokemonId) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (onChangeSuccess) onChangeSuccess(pokemonId);
    }, 150);
  };
  const handleItemUpdate = (e, newId) => {
    e.preventDefault();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (onChangeSuccess) {
        onChangeSuccess(newId);
      }
    }, 150);
  };
  const handleForgetMove = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (onForgetMove) onForgetMove();
    }, 150);
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
    .map((itemId) => {
      const match = itemData.find((i) => i.id === itemId);
      return match || { id: itemId, name: itemId }; // Fallback if item isn't in items.json
    })
    .filter((item) => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  const moveList =
    pokemon?.pokemonId && learnsetData[pokemon.pokemonId]
      ? learnsetData[pokemon.pokemonId]
          .map((moveId) => {
            const match = moveData.find((m) => m.id === moveId);
            return match ? match : null;
          })
          .filter(Boolean)
          .filter((move) => {
            return move.name.toLowerCase().includes(searchQuery.toLowerCase());
          })
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
                    else if (type === "pokemonChange") handleChange(e, mon.id);
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
                  key={item.id}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-2xl p-4 transition hover:bg-base-light"
                  onClick={(e) => handleItemUpdate(e, item.id)}
                >
                  {/* <ItemSprite item={item.id} /> */}
                  <p className="font-normal">{item.name}</p>
                </div>
              ))}
              {itemList.length === 0 && (
                <p className="flex h-full items-center justify-center text-base-text-darker">
                  No results
                </p>
              )}
            </>
          )}
          {/* move */}
          {type === "move" && (
            <>
              {moveList.map((move) => (
                <div
                  key={move.id}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl p-4 transition hover:bg-base-light"
                  onClick={(e) => handleChange(e, move.id)}
                >
                  {/* <ItemSprite item={item} /> */}
                  <p className="font-normal">{move.name}</p>
                  <span className={`${styles[move.type]}`}>{move.type}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          {type === "item" && pokemon.item && (
            <div onClick={(e) => handleItemUpdate(e, "")}>
              <Button text={"Remove Item"} />
            </div>
          )}
          {type === "move" && hasExistingMove && (
            <div onClick={handleForgetMove}>
              <Button text={"Forget Move"} />
            </div>
          )}
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

function checkTeamLegality(currentTeam) {
  if (!currentTeam || !currentTeam.pokemon || currentTeam.pokemon.length !== 6)
    return false;

  const currentFormat = formatData.find((f) => f.id === currentTeam.format);
  const dexNumbers = [];
  const heldItems = [];

  for (const p of currentTeam.pokemon) {
    if (!p.pokemonId) return false;

    const monInfo = pokemonData.find((pm) => pm.id === p.pokemonId);
    if (!monInfo) return false;

    // 1. Format Restrictions
    if (currentFormat) {
      if (currentFormat.pokemon && !currentFormat.pokemon.includes(p.pokemonId))
        return false;
      if (
        currentFormat.bannedPokemon &&
        currentFormat.bannedPokemon.includes(p.pokemonId)
      )
        return false;
    }

    // 2. Item Legality & Uniqueness
    if (p.item) {
      if (
        currentFormat?.items?.length > 0 &&
        !currentFormat.items.includes(p.item)
      )
        return false;
      if (heldItems.includes(p.item)) return false;
      heldItems.push(p.item);
    }

    // 3. Species Clause (Unique Dex Number)
    if (monInfo.dexNumber) {
      if (dexNumbers.includes(monInfo.dexNumber)) return false;
      dexNumbers.push(monInfo.dexNumber);
    }

    // 4. Ability Legality
    if (p.ability && monInfo.abilities) {
      if (!monInfo.abilities.includes(p.ability)) return false;
    }

    // 5. Moves Legality
    if (p.moves && p.moves.length > 0) {
      const targetLearnsetId = monInfo.learnsetId || p.pokemonId;
      const allowedMoves = learnsetData[targetLearnsetId] || [];
      for (const m of p.moves) {
        if (m.moveId && !allowedMoves.includes(m.moveId)) return false;
      }
    }
  }

  return true;
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
        !isDiscover && move
          ? `cursor-pointer hover:bg-base-lighter ${style}`
          : "",
        !isDiscover && !move ? "hover:bg-base-lightest" : "",
      )}
    >
      <span className="block w-full truncate text-start">
        {move ? move.name : "No move"}
      </span>
    </div>
  );
}

function Ev({ pokemon, type, isDiscover, onEvChange }) {
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
  const handleSave = () => {
    setIsEditing(false);
    let finalValue = editValue === "" ? 0 : parseInt(editValue, 10);
    if (finalValue !== currentEv) {
      if (onEvChange) {
        onEvChange(type, finalValue);
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
        !isDiscover ? "group cursor-text rounded-lg hover:bg-base-lighter" : "",
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

function DropDown({ type, current, pokemon, onSelect, pokemonCount }) {
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
    options = mon.abilities.map((abilityId) => {
      const match = abilityData.find((a) => a.id === abilityId);
      return {
        id: abilityId,
        name: match ? match.name : abilityId,
        value: abilityId,
      };
    });
  } else if (type === "format") {
    options = formatData.map((f) => ({ id: f.id, name: f.name, value: f.id }));
  } else if (type === "nature") {
    options = natureData.map((n) => ({ id: n.id, name: n.name, value: n.id }));
  } else if (type === "slot") {
    // Generate an option for every active slot dynamically
    for (let i = 1; i <= pokemonCount; i++) {
      options.push({ id: i, name: `Slot ${i}`, value: i });
    }
  }

  return (
    <div ref={dropdownRef} className="relative inline-block w-fit text-left">
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
        {/* Render the Icon if it's the slot switcher, otherwise text */}
        {type === "slot" ? (
          <Icon
            name="switch"
            color="fill-base-text-darker hover:fill-base-text-dark cursor-pointer"
          />
        ) : (
          <span>{current}</span>
        )}
      </button>

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
                current === option.value || current === option.name
                  ? "text-base-text"
                  : "text-base-text-darker hover:text-base-text",
              )}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
