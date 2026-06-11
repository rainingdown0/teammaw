import { useState } from "react";
import Icon from "@/app/ui/icons";

export default function LoginField({
  name,
  label,
  placeholder,
  password = false,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = password ? (showPassword ? "text" : "password") : "text";

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="h-7 cursor-pointer font-bold">
        {label}
      </label>

      <div className="relative flex w-full items-center">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={password ? "current-password" : "username"}
          suppressHydrationWarning
          className="w-full rounded-full border-2 border-base-base py-4 pr-14 pl-6 font-medium transition placeholder:text-base-light hover:border-base-light focus:border-base-text focus:ring-0 focus:outline-none"
        />

        {password && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 p-2 text-base-light transition hover:text-base-text focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Icon name="eye" color="cursor-pointer fill-base-text" />
            ) : (
              <Icon name="eyeOff" color="cursor-pointer fill-base-text" />
            )}
          </button>
        )}
      </div>

      <div className="h-7 w-full text-right font-medium text-error">
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
