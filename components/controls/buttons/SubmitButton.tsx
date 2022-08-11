import { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
export const SubmitButton = ({ children, ...rest }: SubmitButtonProps) => {
  return (
    <button
      className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
      {...rest}
    >
      {children}
    </button>
  );
};
