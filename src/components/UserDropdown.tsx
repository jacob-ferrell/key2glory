import { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const itemClass = (active: boolean) =>
  `block w-full text-left px-4 py-2 text-sm font-medium ${active ? "bg-zinc-700 text-white" : "text-zinc-200"}`;

export default function UserDropdown() {
  const { logout, user } = useAuth0();
  const name = user?.nickname || user?.name || "Account";

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-zinc-800">
        {user?.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
        ) : null}
        <span className="max-w-[10rem] truncate">{name}</span>
        <ChevronDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right overflow-hidden rounded-md bg-zinc-800 shadow-lg ring-1 ring-black/20 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link to="/user/stats" className={itemClass(active)}>
                My Stats
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link to="/typing-test/browse?mine=FAVORITES" className={itemClass(active)}>
                My Favorites
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link to="/typing-test/browse?mine=CREATED" className={itemClass(active)}>
                My Tests
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={() => logout()} className={`${itemClass(active)} border-t border-zinc-700`}>
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
