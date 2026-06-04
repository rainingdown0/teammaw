export default function LoginField({
  name,
  label,
  placeholder,
  password = false,
  error,
}) {
  return (
    // 1. Changed w-2xl to w-full for better responsiveness
    <div className="flex w-full flex-col gap-2">
      {/* 2. Added htmlFor for accessibility */}
      <label htmlFor={name} className="h-7 cursor-pointer font-bold">
        {label}
      </label>

      <input
        id={name} // 2. Added matching id
        name={name}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        // 3. Added standard autocomplete behavior
        autoComplete={password ? "current-password" : "username"}
        suppressHydrationWarning
        required
        className="flex items-center justify-between rounded-full border-2 border-base-base px-6 py-4 font-medium transition placeholder:text-base-light hover:border-base-light focus:border-base-text focus:ring-0 focus:outline-none"
      />

      <div className="h-7 w-full text-right font-medium text-rose-500">
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
