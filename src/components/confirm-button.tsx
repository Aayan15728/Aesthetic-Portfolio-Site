"use client";

import type { ButtonHTMLAttributes } from "react";

interface ConfirmButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  message: string;
}

/** A submit button that asks "are you sure?" first (the form only submits if you confirm). */
export function ConfirmButton({ message, children, ...props }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
