import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db, convertImageToBase64 } from "../../firebase";
import { Calendar } from "lucide-react";

const categories = [
  "education",
  "charity",
  "informatique",
  "workshops",
  "hiking",
  "games",
];

export default function UpdateAnEvent() {
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef);
      const querySnapshot = await getDocs(q);
      
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date.seconds * 1000).toISOString().split('T')[0],
        duration: doc.data().duration || 1
      }));
      
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event.id);
    setUpdatedEvent({
      title: event.title,
      date: event.date,
      category: event.category,
      description: event.description,
      duration: event.duration,
    });
    setImage(event.image); // Assuming event.image is the URL or base64 string of the image
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const base64Image = image ? await convertImageToBase64(image) : updatedEvent.image;

      const startDate = new Date(updatedEvent.date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (parseInt(updatedEvent.duration) - 1));

      const eventRef = doc(db, "events", selectedEvent);
      await updateDoc(eventRef, {
        ...updatedEvent,
        date: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        duration: parseInt(updatedEvent.duration),
        image: base64Image,
        updatedAt: Timestamp.now(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message || "Failed to update event. Please try again.");
    } finally {
      setIsUpdating(false);
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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="dark:bg-gray-700 shadow-lg border  border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
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
                onChange={(e) => handleEventSelect(events.find(event => event.id === e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.date}
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
                required
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
                required
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