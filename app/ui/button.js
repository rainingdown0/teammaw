export default function Button({ text, color, disabled = false }) {
  let className =
    "flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-base px-6 py-4 text-normal font-semibold text-base-text transition hover:bg-base-light disabled:bg-base-dark disabled:text-base-lighter";

  switch (color) {
    case "primary":
      className =
        "flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-4 text-normal font-semibold text-primary-text transition hover:bg-primary-light disabled:bg-primary-dark disabled:text-primary-lighter";
      break;
    case "accent":
      className =
        "flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-accent px-6 py-4 text-normal font-semibold text-accent-text transition hover:bg-accent-light disabled:bg-accent-dark disabled:text-accent-darker";
      break;
    case "ghost":
      className =
        "flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-transparent px-6 py-4 text-normal font-semibold text-base-text transition hover:bg-base-light disabled:text-base-lighter disabled:hover:bg-transparent";
  }

  return (
    <button disabled={disabled} className={className}>
      {text}
    </button>
  );
}
