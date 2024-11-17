import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { formFields } from "../../services/Details";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        timestamp: Timestamp.now(),
        status: 'pending'
      });

      setSuccess(true);
      setFormData({
        firstn: "",
        lastn: "",
        email: "",
        phone: "",
        academiclevel: "",
        speciality: "",
        faculty: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to add registration. Please try again.");
      console.error("Error adding registration:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="dark:bg-gray-700 shadow-lg border border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold dark:text-green-bk text-gray-900 mb-6">
            Add New Registration
          </h2>

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
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                  {field.label}
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-bk hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-bk disabled:opacity-50"
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