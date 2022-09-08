import React, { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

interface SelectProps<T extends any = any> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (data: T) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}
export const SearchSelect = ({
  options,
  onChange,
  placeholder,
  disabled = false,
}: SelectProps) => {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });
  const disabledInput = disabled || options.length === 0;
  const handleChange = (value: any) => {
    onChange(value);
    setQuery("");
  };
  return (
    <Combobox
      value={undefined}
      onChange={handleChange}
      disabled={disabledInput}
      nullable
      as="div"
      className="w-full"
    >
      {({ open }) => (
        <>
          <div>
            <Combobox.Button className="relative w-full flex items-center cursor-default overflow-hidden rounded bg-neutral-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-1  sm:text-sm">
              <Combobox.Input
                className="w-full  p-2 border-none  text-sm leading-5 focus:outline-none text-white focus:ring-0 bg-neutral-700 ui-disabled:opacity-50"
                onFocus={() => setQuery("")}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                autoComplete="off"
              />
              <span className="absolute right-2 cursor-pointer">
                {!disabledInput &&
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
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="relative z-50 w-full">
              <Combobox.Options
                unmount={false}
                className="absolute mt-2 shadow-xl  max-h-60 w-full overflow-auto rounded-md bg-neutral-600  text-base  ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {filteredOptions.map((value, i) => (
                  <Combobox.Option
                    key={i}
                    className="relative cursor-pointer select-none p-2 ui-active:bg-neutral-500 text-white"
                    value={value.value}
                  >
                    <>
                      <span className="block truncate  ui-selected:font-medium ui-not-selected:font-normal">
                        {value.label}
                      </span>
                    </>
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Transition>
        </>
      )}
    </Combobox>
  );
};
