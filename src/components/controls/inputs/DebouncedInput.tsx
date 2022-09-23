import React, { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import useDebounce from "~/hooks/useDebounce";
import { Input, InputProps } from "./Input";

interface DebouncedInputProps extends InputProps {
  value: string;
  className?: string;
  debounce?: number;
}
export const DebouncedInput = ({
  value,
  onChange,
  debounce = 1000,
  className,
  ...props
}: DebouncedInputProps) => {
  const [interValue, setInterValue] = useState(value);
  const [inputEvent, setInputEvent] =
    useState<React.ChangeEvent<HTMLInputElement>>();

  const debouncedInput = useDebounce(inputEvent, debounce);

  useEffect(() => {
    if (debouncedInput.value) onChange?.(debouncedInput.value);
  }, [debouncedInput.value, onChange]);

  return (
    <div className={`w-content relative flex items-center ${className}`}>
      <Input
        value={interValue}
        onChange={(e) => {
          setInputEvent(e);
          setInterValue(e.target.value);
        }}
        {...props}
      />
      <span className="absolute right-1 animate-bounce">
        {debouncedInput.debouncing && <HiPencil />}
      </span>
    </div>
  );
};
