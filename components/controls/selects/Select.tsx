import { Listbox } from "@headlessui/react";

type Option<T extends any = any> = {
  value: T;
  label: string;
  id?: string;
};

interface SelectProps<T extends any = any> {
  value: T;
  options: Option<T>[];
  onChange: (data: T) => void;
  className?: string;
}
export const Select = <T extends string>({
  value,
  options,
  onChange,
  className,
}: SelectProps<T>) => {
  const getLabel = (value: T) => {
    const option = options.find((option) => option.value === value);
    if (option) return option.value;
    return value;
  };
  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="input input-text input-border w-full relative truncate text-left border p-2 rounded">
          <div className="truncate">{getLabel(value)}</div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            ▼
          </span>
        </Listbox.Button>
        <Listbox.Options className="w-fit mt-1.5 divide-y z-10 bg-gray-700 divide-neutral-300 border border-neutral-400 rounded max-h-60 overflow-y-auto absolute scrollbar">
          {options.map((options) => (
            <Listbox.Option
              key={options.id ?? options.label}
              value={options.value}
              className="flex gap-2 items-center p-2   last:rounded-b first:rounded-t truncate  hover:bg-gray-600   cursor-pointer "
            >
              {options.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};
