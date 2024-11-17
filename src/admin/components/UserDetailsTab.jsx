import { useState, useEffect } from "react";
import { collection, query, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { BiSearch, BiTrash, BiEdit } from "react-icons/bi";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import EditModal from "./EditModal";

const UserDetailsTab = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "descending",
  });

  const columns = [
    { Header: "First Name", accessor: "firstn" },
    { Header: "Last Name", accessor: "lastn" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Academic Level", accessor: "academiclevel" },
    { Header: "Faculty", accessor: "faculty" },
    { Header: "Registration Date", accessor: "timestamp" },
  ];

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef);
      const querySnapshot = await getDocs(q);
      const registrationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: new Date(doc.data().timestamp.seconds * 1000).toLocaleDateString()
      }));
      setUsers(registrationsData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        const registrationRef = doc(db, 'registrations', userId);
        await deleteDoc(registrationRef);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting registration:", error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all registrations? This action cannot be undone.")) {
      try {
        const batch = writeBatch(db);
        users.forEach(user => {
          const docRef = doc(db, 'registrations', user.id);
          batch.delete(docRef);
        });
        await batch.commit();
        setUsers([]);
      } catch (error) {
        console.error("Error deleting all registrations:", error);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

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
      user.firstn?.toLowerCase().includes(searchTerm) ||
      user.lastn?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.phone?.toLowerCase().includes(searchTerm)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
    </div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mt-2 mb-6 dark:text-green-bk font-extrabold tracking-wide leading-tight">
        Registration Details
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
          Entries Per Page:
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
      <button 
        onClick={handleDeleteAll}
        className="text-white mt-5 flex mr-2 items-center bg-red-500 hover:bg-red-800 p-2 rounded self-end"
      >
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
              <th className="px-6 py-4 font-bold">Actions</th>
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
                <td className="px-6 py-4 flex items-center space-x-2">
                  <BiTrash
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 text-xl cursor-pointer"
                  />
                  <BiEdit
                    onClick={() => handleEditClick(user)}
                    className="text-blue-600 text-xl cursor-pointer"
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

      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserDetailsTab;