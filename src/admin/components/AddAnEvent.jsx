import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, convertImageToBase64 } from "../../firebase";
import { Calendar } from "lucide-react";
//import eventsData from "../../services/eventsdetails.json";

const categories = [
  "education",
  "charity",
  "informatique",
  "workshops",
  "hiking",
  "games",
];

export default function AddAnEvent() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    duration: "",
  });
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select an image");
      return;
    }

    try {
      setIsUploading(true);

      const base64Image = await convertImageToBase64(image);

      const eventData = {
        title: newEvent.title,
        date: new Date(newEvent.date).toISOString(),
        category: newEvent.category,
        image: base64Image,
        description: newEvent.description,
        duration: newEvent.duration,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "events"), eventData);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setNewEvent({
        title: "",
        date: "",
        category: "",
        description: "",
        duration: "",
      });
      setImage(null);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.message || "Failed to add event. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAll = async () => {
    try {
      setIsUploading(true);
      setError("");

      for (const event of eventsData.events) {
        const eventData = {
          ...event,
          date: new Date(event.date.split("/").reverse().join("-"))
            .toISOString()
            .slice(0, 10),
          createdAt: new Date().toISOString().slice(0, 10),
          image:
            event.image ||
            "https://placehold.co/600x400/1B9C85/FFFFFF/png?text=Event+Image",
        };

        await addDoc(collection(db, "events"), eventData);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding all events:", error);
      setError(error.message || "Failed to add all events. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
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
              Add New Event
            </h2>
            <Calendar className="h-6 w-6 text-green-bk" />
          </div>

          {/* <div className="mb-6">
            <button
              onClick={handleAddAll}
              disabled={isUploading}
              className="w-full bg-green-bk text-white py-2 px-4 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {isUploading ? "Adding All Events..." : "Add All Events"}
            </button>
          </div> */}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
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
                value={newEvent.date}
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
                value={newEvent.category}
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
                value={newEvent.duration}
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
                value={newEvent.description}
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
                {isUploading ? "Uploading..." : "Add Event"}
              </button>
            </div>
          </form>

          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Event added successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
