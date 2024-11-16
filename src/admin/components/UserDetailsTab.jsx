import { useState } from "react";
import usersdata from "../data/usersdata.json";
import { BiSearch, BiTrash } from "react-icons/bi";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const UserDetailsTab = () => {
  const [users] = useState(usersdata);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Creation Date", accessor: "creationDate" },
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.toLowerCase().includes(searchTerm)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mt-2 mb-6 dark:text-green-bk font-extrabold tracking-wide leading-tight">
        Inscription Details
      </h2>
      <div className="flex gap-4 items-center">
        <div className="relative">
          <input
            className="p-3 w-48 lg:w-96 text-lg text-gray-900 border border-gray-300 rounded-full pl-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
            type="text"
            placeholder="Search anything"
            onChange={handleSearch}
          />
          <BiSearch className="absolute left-3 top-4 text-2xl text-gray-500" />
        </div>
        <label htmlFor="usersPerPage" className="text-lg dark:text-green-bk">
          Users Per Page:
        </label>
        <select
          id="usersPerPage"
          className="text-lg focus:outline-none dark:text-gray-900 focus:ring-offset-1 focus:ring focus:ring-green-bk border-green-bk border rounded-lg"
          value={usersPerPage}
          onChange={handleUsersPerPageChange}
        >
          {[5, 10, 20, 30, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <button className="text-white mt-5 flex mr-2 items-center bg-red-500 hover:bg-red-800 p-2 rounded self-end">
        Delete All
        <BiTrash className="ml-2" />
      </button>
      <div className="w-full mt-4 overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-green-bk dark:text-gray-900">
            <tr>
              {columns.map(({ accessor, Header }) => (
                <th
                  key={accessor}
                  scope="col"
                  className="px-6 py-4 font-bold cursor-pointer"
                  onClick={() => requestSort(accessor)}
                >
                  {Header}
                  {sortConfig.key === accessor ? (
                    sortConfig.direction === "ascending" ? (
                      <IoMdArrowDropup className="inline" />
                    ) : (
                      <IoMdArrowDropdown className="inline" />
                    )
                  ) : null}
                </th>
              ))}
              <th className="px-6 py-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#42c9b7] bg-[#7eddd1] dark:text-gray-800"
              >
                {columns.map(({ accessor }) => (
                  <td key={accessor} className="px-6 py-4">
                    {user[accessor]}
                  </td>
                ))}
                <td className="px-6 py-4 flex items-center">
                  <BiTrash
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-600 ml-2 text-xl cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex flex-row mt-5">
        <button
          className="block rounded-lg bg-gradient-to-tr from-emerald-800 to-green-bk py-2 px-4 text-sm font-bold text-white shadow-md hover:shadow-lg active:opacity-85 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-lg mx-2">Page {currentPage}</span>
        <button
          className="block rounded-lg bg-gradient-to-tr from-emerald-800 to-green-bk py-2 px-4 text-sm font-bold text-white shadow-md hover:shadow-lg active:opacity-85 disabled:opacity-50"
          disabled={indexOfLastUser >= filteredUsers.length}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDetailsTab;
