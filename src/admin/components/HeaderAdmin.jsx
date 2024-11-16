import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import logo from "../../assets/logo.png";
import React from "react";
export default function HeaderAdmin({
  darkMode,
  toggledarkMode,
  toggleSideBar,
}) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <div className="p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center justify-start rlt:jutify-end ">
            <button
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleSideBar}
            >
              <HiOutlineMenuAlt2 className="text-2xl" />
            </button>
            <a href="#" className="flex ms-3 md:me-24">
              <img src={logo} className="h-10" alt="" />{" "}
              <span className="self-center text-wl font-semibold sm:text-2xl whitespace-nowrap dark:text-green-bk">
                DashBoard
              </span>
            </a>
          </div>
          <button
            className="dark:bg-slate-50 dark:text-slate-700 rounded-full p-2"
            onClick={toggledarkMode}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
