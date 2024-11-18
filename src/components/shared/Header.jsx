import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleClick = (link) => {
    setActiveLink(link);
    closeMenu();
  };

  const handleLogoClick = () => {
    setActiveLink("home");
  };

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-1 border-gray-one7 bg-dark-one7 py-3 px-6 lg:px-24">
      <Link to="/" onClick={handleLogoClick}>
        <img src={logo} className="w-14 mr-2" alt="Logo" />
      </Link>
      <div className="block lg:hidden">
        <button
          onClick={toggleMenu}
          className="flex items-center px-3 py-2 rounded text-white"
        >
          <svg
            className={`fill-current h-6 w-6 text-white ${
              isOpen ? "hidden" : "block"
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-current h-6 w-6 text-white ${
              isOpen ? "block" : "hidden"
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>

      <div
        className={`absolute top-full flex-grow border-gray-one7 left-0 w-full bg-dark-one7 lg:static lg:w-auto lg:flex lg:items-center lg:bg-transparent ${
          isOpen ? "block border-1 pb-4 border-b" : "hidden border-0 pb-0"
        }`}
      >
        <div className="text-md space-x-2 flex flex-col lg:flex-row justify-end items-center lg:flex-grow">
          <Link
            to="/"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white font-semibold py-2 px-4 rounded-md ${
              activeLink === "home" ? "bg-gray-one7" : "hover:bg-gray-one7"
            }`}
            onClick={() => handleClick("home")}
          >
            Home
          </Link>
          <Link
            to="/event"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white font-semibold py-2 px-4 rounded-md ${
              activeLink === "event" ? "bg-gray-one7" : "hover:bg-gray-one7"
            }`}
            onClick={() => handleClick("event")}
          >
            Events
          </Link>
          <Link
            to="/about"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white font-semibold py-2 px-4 rounded-md ${
              activeLink === "about" ? "bg-gray-one7" : "hover:bg-gray-one7"
            }`}
            onClick={() => handleClick("about")}
          >
            About Us
          </Link>
          <Link
            to="/team"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white font-semibold py-2 px-4 rounded-md ${
              activeLink === "team" ? "bg-gray-one7" : "hover:bg-gray-one7"
            }`}
            onClick={() => handleClick("team")}
          >
            Our Team
          </Link>
        </div>
      </div>
    </nav>
  );
}
