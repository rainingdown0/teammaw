import { useState } from "react";
import Icon from "@/app/ui/icons";

export default function LoginField({
  name,
  label,
  placeholder,
  password = false,
  error,
}) {
  // State to track if the password is currently visible
  const [showPassword, setShowPassword] = useState(false);

  // Determine the correct input type based on the 'password' prop and current state
  const inputType = password ? (showPassword ? "text" : "password") : "text";

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="h-7 cursor-pointer font-bold">
        {label}
      </label>

      {/* Wrapper div set to relative so the button can be positioned absolutely inside it */}
      <div className="relative flex w-full items-center">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={password ? "current-password" : "username"}
          suppressHydrationWarning
          // Replaced px-6 with pl-6 and pr-14 to prevent text from typing underneath the icon
          className="w-full rounded-full border-2 border-base-base py-4 pr-14 pl-6 font-medium transition placeholder:text-base-light hover:border-base-light focus:border-base-text focus:ring-0 focus:outline-none"
        />

        {/* Only render the toggle button if this is a password field */}
        {password && (
          <button
            type="button" // Important: prevents the button from submitting a form
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
