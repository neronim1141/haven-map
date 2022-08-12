import React, { InputHTMLAttributes } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  label?: string;
  id: Path<T>;
  error?: FieldError;
}

export const Input = <T extends FieldValues = FieldValues>({
  register,
  label,
  id,
  error,
  ...rest
}: InputProps<T>) => {
  return (
    <div className="flex flex-col ">
      {label && (
        <label className="mb-2 font-bold tracking-wide text-lg">{label}</label>
      )}

      <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
        <input
          type="text"
          placeholder="Email or Username"
          className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none  "
          {...register(id)}
          {...rest}
        />
      </div>
      <span role="alert" className="mt-1 text-sm text-red-600 font-bold">
        {error && (error.message || "invalid")}
      </span>
    </div>
  );
};
