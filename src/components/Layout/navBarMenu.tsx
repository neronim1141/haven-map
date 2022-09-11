import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, ReactNode } from "react";
import { HiMenu } from "react-icons/hi";

interface NavBarMenuProps {
  children: ReactNode[];
  icon?: ReactNode;
}
export const NavBarMenu = ({ children, icon }: NavBarMenuProps) => {
  return (
    <Menu as="div" className="text-left  ">
      <div>
        <Menu.Button className=" inline-flex  justify-center rounded-md p-1  text-2xl font-medium text-white hover:bg-neutral-400 hover:text-neutral-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {icon ?? <HiMenu />}
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
        <div className="relative z-50 ">
          <Menu.Items className="absolute right-0 w-32 rounded-md bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul className="flex flex-col divide-y p-1">
              {children
                .filter((action) => React.isValidElement(action))
                .map((action, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <li
                        className={clsx(
                          { "bg-neutral-600": active },
                          `w-full min-w-max p-1 text-center`
                        )}
                      >
                        {action ?? "lol"}
                      </li>
                    )}
                  </Menu.Item>
                ))}
            </ul>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};
