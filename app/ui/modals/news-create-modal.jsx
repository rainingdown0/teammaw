"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { createArticle } from "@/lib/actions/news-actions";
import Button from "../button";

export default function NewsCreateModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
