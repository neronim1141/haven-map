import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "danger";
  size?: "sm" | "md";
}

export const Button = ({
  children,
  className,
  variant,
  size = "md",
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={clsx(
        {
          "bg-neutral-600 enabled:hover:bg-neutral-500": !variant,
          "border border-neutral-600 enabled:hover:bg-neutral-500":
            variant === "outline",
          "bg-red-600 enabled:hover:bg-red-500": variant === "danger",
        },
        {
          "px-2 py-1 text-sm": size === "sm",
          "px-4 py-2": size === "md",
        },
        "flex w-max items-center gap-1 rounded font-bold text-white disabled:opacity-50 ",
        className
      )}
    >
      {children}
    </button>
  );
};
