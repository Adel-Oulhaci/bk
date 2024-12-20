import { useState, useEffect } from "react";
import { useEvents } from "../context/EventsContext";
import { Calendar, HeartHandshake, Monitor, BookOpen, Mountain } from "lucide-react";
import { GrWorkshop } from "react-icons/gr";
import { IoGameControllerOutline, IoCloseSharp } from "react-icons/io5";
import Navbar from "../components/event/Navbar";
import EventCard from "../components/event/EventCard";
import reg from "../assets/Cvrt1.png";

const categories = [
  { id: "all", label: "All", icon: Calendar },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "charity", label: "Charity", icon: HeartHandshake },
  { id: "informatique", label: "Informatique", icon: Monitor },
  { id: "workshops", label: "Workshops", icon: GrWorkshop },
  { id: "hiking", label: "Hiking", icon: Mountain },
  { id: "games", label: "Games", icon: IoGameControllerOutline },
];

function Event() {
  const { events, loading, error } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!events.length) return;
    
    if (selectedCategory === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.category === selectedCategory));
    }
  }, [selectedCategory, events]);

  const handleLearnMore = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-bk text-white rounded-md hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <img
          src={reg}
          className="w-full h-64 sm:h-[400px] md:h-[600px] object-cover blur-sm"
          alt="Events banner"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2">
          <h1 className="uppercase text-center text-white font-semibold mb-1 text-3xl sm:text-5xl md:text-6xl lg:mb-6 lg:text-7xl">
            our events
          </h1>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="container mx-auto px-4 py-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-600 mt-8">
              No events found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onLearnMore={() => handleLearnMore(event)}
                />
              ))}
            </div>
          )}
        </main>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {selectedEvent.title}
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Date:</strong> {selectedEvent.date.split("T")[0]}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Category:</strong>{" "}
                {selectedEvent.category.charAt(0).toUpperCase() +
                  selectedEvent.category.slice(1)}
              </p>
              <p className="text-gray-700">
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-green-bk px-3 py-1 rounded-full text-3xl font-medium"
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Event;
