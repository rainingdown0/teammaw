"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Button from "../button";

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
