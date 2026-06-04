export default function NewsCard({ title, date, content }) {
  return (
    <div className="flex h-fit w-full min-w-0 cursor-pointer flex-col gap-4 rounded-2xl bg-base-base p-4 transition hover:bg-base-light">
      <span className="text-small">{date}</span>
      <h3 className="w-full text-large font-semibold wrap-break-word">
        {title}
      </h3>
      <p className="w-full truncate">{content}</p>
    </div>
  );
}
