export default function LoginField({
  name,
  label,
  placeholder,
  password = false,
  error,
}) {
  return (
    <div className="flex w-2xl flex-col gap-2">
      <label className="h-7 text-normal font-bold">{label}</label>
      <input
        name={name}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        className="flex items-center justify-between rounded-full border-2 border-base px-6 py-4 font-medium transition placeholder:text-base-light hover:border-base-light focus:border-base-text focus:ring-0 focus:outline-none"
      />
      <div className="h-7 w-full text-right font-medium text-rose-500">
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
