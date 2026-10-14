"use client";

import { useEffect, useId, useRef, useState } from "react";

export type DarkSelectOption = {
  value: string;
  label: string;
};

type DarkSelectProps = {
  id: string;
  name: string;
  placeholder: string;
  options: readonly DarkSelectOption[];
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  resetKey?: string;
};

export default function DarkSelect({
  id,
  name,
  placeholder,
  options,
  disabled = false,
  loading = false,
  loadingLabel = "Checking availability...",
  emptyLabel,
  resetKey,
}: DarkSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const isDisabled = disabled || loading;
  const displayLabel = loading
    ? loadingLabel
    : selected?.label ?? (options.length === 0 && emptyLabel ? emptyLabel : placeholder);

  useEffect(() => {
    setValue("");
    setOpen(false);
  }, [resetKey]);

  useEffect(() => {
    if (value && !options.some((option) => option.value === value)) {
      setValue("");
    }
  }, [options, value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-busy={loading}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled || options.length === 0) return;
          setOpen((current) => !current);
        }}
        className="flex w-full items-center justify-between rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-left text-sm text-[#F4F1ED] outline-none transition-colors duration-300 focus:border-[#F4F1ED]/60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`min-w-0 flex-1 ${
            selected && !loading ? "text-[#F4F1ED]" : "text-[#F4F1ED]/40"
          }`}
        >
          {displayLabel}
        </span>
        <span className="text-[#F4F1ED]/50" aria-hidden>
          ▾
        </span>
      </button>
      {open && !isDisabled && options.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="mt-1 max-h-60 w-full overflow-auto border border-gray-800 bg-[#1A1A1A] py-1"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm text-[#F4F1ED] hover:bg-[#2A2A2A] ${
                    isSelected ? "bg-[#2A2A2A]" : "bg-[#1A1A1A]"
                  }`}
                  onClick={() => {
                    setValue(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
