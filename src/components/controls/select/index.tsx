import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

interface SelectProps<T extends any = any> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (data: T) => void;
  disabled?: boolean;
  className?: string;
}
export const Select = ({
  value,
  options,
  onChange,
  className,
  disabled = false,
}: SelectProps) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <>
          <Listbox.Button
            className={`flex justify-between bg-neutral-700 w-full rounded text-white p-2 text-left shadow-md focus:outline-none focus-visible:ring-neutral-500  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-1  sm:text-sm ${className}`}
          >
            <span className=" truncate flex-grow ">{value.label}</span>
            <span className="pointer-events-none  ">
              {!disabled &&
                (open ? (
                  <HiChevronUp
                    className="h-5 w-5 text-neutral-400"
                    aria-hidden="true"
                  />
                ) : (
                  <HiChevronDown
                    className="h-5 w-5 text-neutral-400"
                    aria-hidden="true"
                  />
                ))}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="relative z-50">
              <Listbox.Options className="absolute mt-1  max-h-60 w-full overflow-auto rounded-md bg-neutral-600  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((value, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-pointer select-none p-2 ${
                        active ? "bg-neutral-500 text-white" : "text-white"
                      }`
                    }
                    value={value.value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {value.label}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </>
      )}
    </Listbox>
  );
};
