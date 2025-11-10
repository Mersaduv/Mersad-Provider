"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ToggleSwitchProps extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
  ...labelProps
}: ToggleSwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 cursor-pointer select-none",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      {...labelProps}
    >
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            if (disabled) return;
            onChange(event.target.checked);
          }}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "w-12 h-7 rounded-full transition-colors duration-200 ease-in-out",
            "bg-gray-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-500",
            "peer-checked:bg-blue-600"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
            "peer-checked:translate-x-5"
          )}
        />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {description ? (
          <span className="text-xs text-gray-500 leading-snug max-w-xs">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

