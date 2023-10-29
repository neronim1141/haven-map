import React, { InputHTMLAttributes } from "react";
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      type="text"
      className={`relative w-full min-w-[6rem] truncate rounded bg-neutral-600 p-2 pr-7 outline-none focus:ring-2 focus:ring-neutral-400  sm:text-sm ${className}`}
      {...props}
    />
  );
};
