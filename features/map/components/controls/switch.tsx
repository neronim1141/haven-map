import { useState } from "react";
import { Switch as Toggle } from "@headlessui/react";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}
export const Switch = ({ value, onChange, label }: SwitchProps) => {
  return (
    <Toggle.Group>
      <div className="flex items-center">
        <Toggle
          checked={value}
          onChange={onChange}
          className={`${
            value ? "bg-blue-600" : "bg-gray-400"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              value ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Toggle>
        <Toggle.Label>{label}</Toggle.Label>
      </div>
    </Toggle.Group>
  );
};
