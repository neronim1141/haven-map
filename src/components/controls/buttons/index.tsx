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
        "px-4 py-2  text-white w-max rounded flex items-center gap-1 ",
        className
      )}
    >
      {children}
    </button>
  );
};
