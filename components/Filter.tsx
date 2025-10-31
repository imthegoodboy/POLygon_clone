import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";

interface Props {
  list: string[];
  activeItem: string;
  category: string;
  onChange: (item: string) => void;
}

export const Filter: React.FC<Props> = ({
  list,
  activeItem,
  category,
  onChange,
}) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center px-5 py-3 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 border border-white/20 transition-all">
            {category}: <span className="ml-1 font-bold">{activeItem}</span>
            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 text-white"
              aria-hidden="true"
            />
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
          <Menu.Items className="z-50 absolute left-0 w-56 mt-3 origin-top-left bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl focus:outline-none overflow-hidden">
            <div className="px-2 py-2">
              {list.map((item) => (
                <Menu.Item key={item}>
                  {({ active }) => {
                    return (
                      <button
                        onClick={() => onChange(item)}
                        className={`${
                          activeItem === item 
                            ? "bg-white/30 text-white font-bold" 
                            : "text-white/80 hover:bg-white/20"
                        } font-medium group flex rounded-xl items-center w-full px-4 py-3 text-sm transition-all my-1`}
                      >
                        {item}
                      </button>
                    );
                  }}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
