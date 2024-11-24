import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaSignOutAlt,
  FaUserFriends,
  FaCalendarCheck,
} from "react-icons/fa";

export default function SideBar({ isSideBarOpen, setIsSideBarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLinkClick = () => {
    setIsSideBarOpen(false);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
        isSideBarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col justify-between px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 pl-4 font-semibold">
          <li>
            <Link
              to="."
              onClick={handleLinkClick}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaUserFriends className="mr-2" />
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full">
                List of Inscription
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="./addaninscription"
              onClick={handleLinkClick}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaUserAlt className="mr-2" />
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full">
                Add an Inscription
              </span>
            </Link>
          </li>
          {/* <li>
            <Link
              to="./listofevents"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCalendarAlt className="mr-2" />
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full ">
                List of Events
              </span>
            </Link>
          </li> */}
          <li>
            <Link
              to="./addanevent"
              onClick={handleLinkClick}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCalendarCheck className="mr-2" />
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full">
                Add an Event
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="./updateanevent"
              onClick={handleLinkClick}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCalendarCheck className="mr-2" />
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full">
                Update an Event
              </span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto pl-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-green-bk hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
          >
            <FaSignOutAlt className="mr-2" />
            <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
