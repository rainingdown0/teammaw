export default function AppStatCard({ title = "Title", value = "Value" }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-base-base p-8">
      <p className="w-full text-center text-hero font-extrabold">{value}</p>
      <h3 className="w-full text-center font-medium">{title}</h3>
    </div>
  );
}
