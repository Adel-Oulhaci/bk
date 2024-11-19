import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { BiSearch, BiTrash, BiEdit } from "react-icons/bi";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

const UserDetailsTab = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "descending",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [isDeleteAll, setIsDeleteAll] = useState(false);

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
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const now = Timestamp.now();

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date.seconds * 1000),
        isPast: doc.data().date.seconds < now.seconds,
      }));

      setEvents(eventsData);
      // Set the first upcoming event as default
      const upcomingEvent = eventsData.find((event) => !event.isPast);
      if (upcomingEvent) {
        setSelectedEvent(upcomingEvent);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const registrationsRef = collection(db, "registrations");
      const q = query(
        registrationsRef,
        where("eventId", "==", selectedEvent.id)
      );
      const querySnapshot = await getDocs(q);
      const registrationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: new Date(
          doc.data().timestamp.seconds * 1000
        ).toLocaleDateString(),
      }));
      setUsers(registrationsData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setIsModalOpen(true);
    setIsDeleteAll(false);
  };

  const handleDeleteAll = () => {
    setIsModalOpen(true);
    setIsDeleteAll(true);
  };

  const confirmDelete = async () => {
    if (isDeleteAll) {
      try {
        const batch = writeBatch(db);
        users.forEach((user) => {
          const docRef = doc(db, "registrations", user.id);
          batch.delete(docRef);
        });
        await batch.commit();
        setUsers([]);
      } catch (error) {
        console.error("Error deleting all registrations:", error);
      }
    } else if (deleteUserId) {
      try {
        const registrationRef = doc(db, "registrations", deleteUserId);
        await deleteDoc(registrationRef);
        setUsers(users.filter((user) => user.id !== deleteUserId));
      } catch (error) {
        console.error("Error deleting registration:", error);
      }
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
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

  const handleEventChange = (event) => {
    setSelectedEvent(event);
    setCurrentPage(1);
  };

  const togglePastEvents = () => {
    setShowPastEvents(!showPastEvents);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredEvents = showPastEvents
    ? events.filter((event) => event.isPast)
    : events.filter((event) => !event.isPast);

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
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mt-2 mb-6 dark:text-green-bk font-extrabold tracking-wide leading-tight">
        Registration Details
      </h2>

      <div className="w-full max-w-4xl mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
          <button
            onClick={togglePastEvents}
            className={`px-4 py-2 rounded-lg ${
              showPastEvents
                ? "bg-gray-600 text-white"
                : "bg-green-bk text-white"
            }`}
          >
            {showPastEvents ? "Show Upcoming Events" : "Show Past Events"}
          </button>
          <select
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            onChange={(e) => handleEventChange(JSON.parse(e.target.value))}
            value={selectedEvent ? JSON.stringify(selectedEvent) : ""}
          >
            <option value="">Select an event</option>
            {filteredEvents.map((event) => (
              <option key={event.id} value={JSON.stringify(event)}>
                {event.title} - {new Date(event.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      {selectedEvent && (
        <button
          onClick={handleDeleteAll}
          className="text-white mt-5 flex mr-2 items-center bg-red-500 hover:bg-red-800 p-2 rounded self-end"
        >
          Delete All
          <BiTrash className="ml-2" />
        </button>
      )}

      {selectedEvent && (
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
                      onClick={() =>
                        handleDeleteUser(
                          user.id,
                          `${user.firstn} ${user.lastn}`
                        )
                      }
                      className="text-red-600 text-xl cursor-pointer"
                    />
                    <BiEdit
                      onClick={() => handleEditClick(user)}
                      className="text-yellow-600 text-xl cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={
          isDeleteAll
            ? "Are you sure you want to delete all registrations?"
            : `Are you sure you want to delete the registration for ${deleteUserName}?`
        }
      />

      <div className="pagination flex flex-row mt-5">
        <button
          className="block rounded-lg bg-gradient-to-tr from-emerald-800 to-green-bk py-2 px-4 text-sm font-bold text-white shadow-md hover:shadow-lg active:opacity-85 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-lg mx-2">
          Page {currentPage} of {totalPages}
        </span>
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
            setUsers(
              users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserDetailsTab;
