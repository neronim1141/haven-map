import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "warning";
}
export const ActionButton = ({
  children,
  variant,
  ...rest
}: ActionButtonProps) => {
  return (
    <button
      className={`transform rounded py-2  px-2 font-bold duration-300 ${clsx({
        "bg-indigo-600 hover:bg-indigo-400": !variant,
        "bg-red-600 hover:bg-red-400": variant === "warning",
      })} `}
      {...rest}
    >
      {children}
    </button>
  );
};
