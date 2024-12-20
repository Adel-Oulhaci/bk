import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db, convertImageToBase64 } from "../../firebase";
import { Calendar } from "lucide-react";
import { useEvents } from "../../context/EventsContext";

const categories = [
  "education",
  "charity",
  "informatique",
  "workshops",
  "hiking",
  "games",
];

export default function UpdateAnEvent() {
  const { events: contextEvents } = useEvents();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [updatedEvent, setUpdatedEvent] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    duration: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (contextEvents.length) {
      const formattedEvents = contextEvents.map(event => ({
        ...event,
        date: new Date(event.date).toISOString().split("T")[0],
        formattedDate: new Date(event.date).toLocaleDateString(),
        duration: event.duration || 1,
      }));
      setEvents(formattedEvents);
    }
  }, [contextEvents]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event.id);
    setUpdatedEvent({
      title: event.title,
      date: event.date,
      category: event.category,
      description: event.description,
      duration: event.duration,
    });
    setImage(event.image);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);
    setIsUploading(true);

    try {
      const eventRef = doc(db, "events", selectedEvent);
      const eventDoc = await getDoc(eventRef);
      const currentEventData = eventDoc.data();

      const updateData = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        category: updatedEvent.category,
      };

      if (image && typeof image === 'object') {
        const base64Image = await convertImageToBase64(image);
        if (base64Image.length > 1048576) {
          setError("Image size exceeds the limit after resizing.");
          return;
        }
        updateData.image = base64Image;
      }

      if (updatedEvent.date && updatedEvent.date !== currentEventData.date) {
        const startDate = new Date(updatedEvent.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (parseInt(updatedEvent.duration) - 1));
        updateData.date = startDate.toISOString();
        updateData.endDate = endDate.toISOString();
        updateData.duration = parseInt(updatedEvent.duration);
      }

      await updateDoc(eventRef, updateData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update event:", err);
      setError("Failed to update event. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        e.target.value = "";
        return;
      }

      setImage(file);
      setError("");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="dark:bg-gray-700 shadow-lg border border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-green-bk text-gray-900">
              Update Event
            </h2>
            <Calendar className="h-6 w-6 text-green-bk" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) =>
                  handleEventSelect(
                    events.find((event) => event.id === e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.formattedDate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={updatedEvent.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={updatedEvent.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
              />
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={updatedEvent.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Duration (days)
              </label>
              <input
                type="text"
                name="duration"
                value={updatedEvent.duration}
                onChange={handleChange}
                placeholder=""
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
              />
              <p className="mt-1 text-sm text-gray-500">Max file size: 5MB</p>
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={updatedEvent.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-bk hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-bk disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Update Event"}
              </button>
            </div>
          </form>

          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Event updated successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
