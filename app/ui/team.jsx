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

export function Team({ team, isDiscover }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const autoOpenId = searchParams.get("open");
  const [isModalOpen, setIsModalOpen] = useState(autoOpenId === team.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    if (autoOpenId === team.id) {
      router.replace(pathname, { scroll: false });
    }
  };

  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    getUser(team.userId).then((user) => {
      setUsername(`@${user.username}`);
    });
  }, [team]);
  return (
    <>
      <div
        className="flex w-210 cursor-pointer flex-col gap-4 rounded-2xl border-b-2 border-transparent bg-base-base p-4 transition hover:border-primary"
        onClick={() => setIsModalOpen(true)}
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

      {isModalOpen && !isDiscover && (
        <TeamDetailsModal team={team} onClose={handleClose} />
      )}
      {isDeleteModalOpen && !isDiscover && (
        <TeamDeleteConfirmModal
          team={team}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
