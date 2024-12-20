import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { formFields } from "../../services/Details";
import { FaUserPlus } from "react-icons/fa";
import QRCode from "qrcode";

export default function AddAnInscription() {
  const [formData, setFormData] = useState({
    firstn: "",
    lastn: "",
    email: "",
    phone: "",
    academiclevel: "",
    speciality: "",
    faculty: "",
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const today = new Date().toISOString().slice(0, 10);
      const q = query(eventsRef, orderBy("date", "desc")); 
      const querySnapshot = await getDocs(q);
      
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date), // Store as Date object for proper sorting
      }));

      // Sort events by date in descending order
      const sortedEvents = eventsData.sort((a, b) => b.date - a.date);

      // Convert dates to locale string for display after sorting
      const formattedEvents = sortedEvents.map(event => ({
        ...event,
        date: event.date.toLocaleDateString()
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstn: "",
      lastn: "",
      email: "",
      phone: "",
      academiclevel: "",
      speciality: "",
      faculty: "",
    });
    setSelectedEvent("");
  };

  const generateQRCode = async (registrationData) => {
    try {
      const qrData = JSON.stringify({
        registrationId: registrationData.id,
        name: `${registrationData.firstn} ${registrationData.lastn}`,
        email: registrationData.email,
        eventId: registrationData.eventId,
        timestamp: registrationData.timestamp,
      });

      const qrCodeImage = await QRCode.toDataURL(qrData);
      return qrCodeImage;
    } catch (err) {
      console.error("Error generating QR code:", err);
      throw new Error("Failed to generate QR code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      setError("Please select an event");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const registrationData = {
        ...formData,
        eventId: selectedEvent,
        timestamp: new Date().toISOString().slice(0, 10),
        status: "pending",
      };

      // Add registration to Firestore
      const docRef = await addDoc(
        collection(db, "registrations"),
        registrationData
      );

      // Generate QR code
      const qrCodeImage = await generateQRCode({
        id: docRef.id,
        ...registrationData,
      });

      // Save QR code to subcollection
      await addDoc(collection(db, "registrations", docRef.id, "qrcodes"), {
        code: qrCodeImage,
        createdAt: new Date().toISOString().slice(0, 10),
      });

      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding registration:", err);
      setError("Failed to add registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-700 shadow-lg border border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-green-bk text-gray-900">
              Add New Registration
            </h2>
            <FaUserPlus className="h-6 w-6 text-green-bk" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Registration added successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Select Event
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
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

            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:text-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-bk"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-bk text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-bk disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
