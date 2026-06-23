"use client";

import { TeamSprite } from "./sprite";
import Icon from "./icons";
import { TeamDetailsModal, TeamDeleteConfirmModal } from "./modal";
import { getUser } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { duplicateTeam } from "@/lib/actions";
import formatData from "@/data/formats.json";
import clsx from "clsx";
import { createPortal } from "react-dom";

export function Team({ team, isDiscover }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const autoOpenId = searchParams.get("open");
  const [isModalOpen, setIsModalOpen] = useState(autoOpenId === team.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [username, setUsername] = useState("Loading...");

  const handleClose = () => {
    setIsModalOpen(false);
    if (autoOpenId === team.id) {
      router.replace(pathname, { scroll: false });
    }
  };

  useEffect(() => {
    getUser(team.userId).then((user) => {
      setUsername(`@${user.username}`);
    });
  }, [team]);
  return (
    <>
      <div
        className="flex w-210 flex-col gap-4 rounded-2xl border-b-2 border-transparent bg-base-base p-4 transition hover:border-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col">
          {/* team name */}
          <h2 className="w-full font-bold">{team.name}</h2>
          {/* display username in discover page */}
          {isDiscover && (
            <span className="w-fit max-w-full cursor-pointer truncate text-base-text-darker hover:underline">
              {username}
            </span>
          )}
        </div>
        {/* display pokemon */}
        <div className="flex w-full gap-2">
          {team.pokemon ? (
            [...team.pokemon]
              .sort((a, b) => a.slot - b.slot)
              .map((pokemon) => (
                <TeamSprite
                  key={pokemon.id}
                  pokemon={pokemon.pokemonId}
                  item={pokemon.item}
                />
              ))
          ) : (
            <span className="text-small text-base-text-darker">Empty team</span>
          )}
        </div>
        <div className="flex w-full items-center gap-8">
          <div className="flex w-full items-center gap-4 text-small">
            {/* format name */}
            <span>{formatData.find((f) => f.id === team.format).name}</span>
            {/* display likes in discover page */}
            {isDiscover ? (
              <div className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition hover:bg-base-light">
                <Icon name="heart" color="fill-base-text" />
                <span>{team.likes.length}</span>
              </div>
            ) : (
              // display details in editor
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
          {/* display buttons in editor */}
          {!isDiscover && (
            <div
              className="flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* pokepaste */}
              <Icon
                name="import"
                color="fill-base-text-darker hover:fill-base-text cursor-pointer"
              />
              {/* duplicate team */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateTeam(team);
                }}
              >
                <Icon
                  name="copy"
                  color="fill-base-text-darker hover:fill-base-text cursor-pointer"
                />
              </div>
              {/* delete team */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
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
      {/* modals  */}
      {isModalOpen &&
        createPortal(
          <TeamDetailsModal
            team={team}
            onClose={handleClose}
            isDiscover={isDiscover}
          />,
          document.body,
        )}
      {isDeleteModalOpen &&
        !isDiscover &&
        createPortal(
          <TeamDeleteConfirmModal
            team={team}
            onClose={() => setIsDeleteModalOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}
