import { useState, useEffect } from "react";
import { BiSearch, BiTrash } from "react-icons/bi";
import DeleteModal from "./DeleteModal";
import { useEvents } from "../../context/EventsContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function ListOfEvents() {
  const { events: contextEvents, loading } = useEvents();
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  useEffect(() => {
    if (contextEvents.length) {
      const formattedEvents = contextEvents.map(event => ({
        ...event,
        date: new Date(event.date).toLocaleDateString()
      }));
      setEvents(formattedEvents);
    }
  }, [contextEvents]);

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteDoc(doc(db, "events", selectedEvent.id));
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEventsPerPageChange = (e) => {
    setEventsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortConfig.key === "date") {
      // Always sort dates in descending order regardless of sortConfig direction
      return new Date(b.date) - new Date(a.date);
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEvents = sortedEvents.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm) ||
      event.category?.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Events List</h2>

      <div className="flex gap-4 items-center mb-6">
        <div className="relative">
          <input
            className="p-3 w-48 lg:w-96 text-lg text-gray-900 border border-gray-300 rounded-full pl-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
            type="text"
            placeholder="Search events..."
            onChange={handleSearch}
          />
          <BiSearch className="absolute left-3 top-4 text-2xl text-gray-500" />
        </div>
        <label htmlFor="eventsPerPage" className="text-lg dark:text-green-bk">
          Entries Per Page:
        </label>
        <select
          id="eventsPerPage"
          className="text-lg focus:outline-none dark:text-gray-900 focus:ring-offset-1 focus:ring focus:ring-green-bk border-green-bk border rounded-lg"
          value={eventsPerPage}
          onChange={handleEventsPerPageChange}
        >
          {[5, 10, 20, 30, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-green-bk text-white">
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("title")}
              >
                Title
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("date")}
              >
                Date
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("category")}
              >
                Category
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("duration")}
              >
                Duration
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-[#42c9b7] bg-[#7eddd1] dark:text-gray-800"
              >
                <td className="px-6 py-4">{event.title}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4">{event.duration} days</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDeleteModal(true);
                    }}
                  >
                    <BiTrash className="text-red-600 text-xl cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination flex flex-row mt-5 justify-center">
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
          disabled={indexOfLastEvent >= filteredEvents.length}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        message={`Are you sure you want to delete the event "${selectedEvent?.title}"?`}
      />
    </div>
  );
}
