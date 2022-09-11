import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "danger";
}

export const Button = ({
  children,
  className,
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={clsx(
        {
          "bg-neutral-600 hover:bg-neutral-500": !variant,
          "border border-neutral-600 hover:bg-neutral-500":
            variant === "outline",
          "bg-red-600 hover:bg-red-500": variant === "danger",
        },
        "flex w-max  items-center gap-1 rounded px-4 py-2 text-white disabled:opacity-50 ",
        className
      )}
    >
      {children}
    </button>
  );
};
