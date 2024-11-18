import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderAdmin from "./HeaderAdmin";
import SideBar from "./SideBar";

export default function AdminLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggledarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} font-quickSand`}>
      <div>
        <HeaderAdmin
          toggledarkMode={toggledarkMode}
          darkMode={darkMode}
          toggleSideBar={toggleSideBar}
        />
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      </div>
      <div className="mt-14 dark:text-gray-50 text-gray-900 h-full p-4 sm:ml-64 bg-gray-50 dark:bg-gray-800 translate-all duration-200">
        <Outlet />
      </div>
    </div>
  );
}
