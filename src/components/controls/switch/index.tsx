import React, { useState } from "react";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}
export const Toggle = ({ value, onToggle, label }: ToggleProps) => {
  return (
    <Switch.Group>
      <Switch
        checked={value}
        onChange={onToggle}
        className={`${
          value ? "bg-neutral-800 " : "bg-neutral-800 "
        } relative inline-flex h-6 w-11 items-center rounded-full border`}
      >
        <span
          className={`${
            value ? "translate-x-6  bg-green-500" : "translate-x-1  bg-red-500"
          } inline-block h-4 w-4 transform rounded-full`}
        />
      </Switch>
      <Switch.Label className="mr-4 text-white">{label}</Switch.Label>
    </Switch.Group>
  );
};
