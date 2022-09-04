import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { HiDotsVertical } from "react-icons/hi";

interface ActionsMenuProps {
  actions: {
    name: string;
    onClick: () => void;
    variant?: "warning" | "default";
    icon?: React.ElementType;
  }[];
}
export const ActionsMenu = ({ actions }: ActionsMenuProps) => {
  return (
    <Menu as="div" className="text-left ">
      <div>
        <Menu.Button className=" inline-flex  justify-center rounded-md text-xl bg-opacity-20 py-1 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <HiDotsVertical />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="relative ">
          <Menu.Items className="divide-y absolute right-0   divide-gray-100 rounded-md bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="  px-1 py-1    ">
              {actions.map((action) => (
                <Menu.Item key={action.name}>
                  {({ active }) => (
                    <button
                      onClick={action.onClick}
                      className={`${
                        active
                          ? clsx({
                              "bg-blue-700": !action.variant,
                              "bg-red-700": action.variant,
                            })
                          : "text-white"
                      } group flex w-full  gap-1 items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {action.icon && (
                        <action.icon
                          className={clsx({
                            "text-blue-400": !action.variant,
                            "text-red-400": action.variant,
                          })}
                          aria-hidden="true"
                        />
                      )}
                      <span className="w-max">{action.name}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};
