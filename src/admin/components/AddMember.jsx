import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { responsables, members } from "../../services/Details";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setError("");
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    try {
      setIsUploading(true);
      const base64Image = await convertImageToBase64(formData.image);

      if (base64Image.length > 1048576) {
        setError("Image size exceeds the limit after resizing.");
        setFormData((prev) => ({ ...prev, image: "" }));
        return;
      }

      const memberData = {
        name: formData.name,
        role: formData.role,
        image: base64Image,
        date: formData.date,
      };

      await addDoc(collection(db, "members"), memberData);
      setSuccess(true);
      setFormData({ name: "", role: "", image: "", date: "" });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Failed to add member:", err);
      setError("Failed to add member. Please try again.");
      setFormData((prev) => ({ ...prev, image: "" }));
    } finally {
      setIsUploading(false);
    }
  };

  const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return await convertImageToBase64(blob);
  };

  const handleAddAll = async () => {
    console.log("Add All button clicked");
    setError("");
    setSuccess(false);

    try {
      for (const member of members) {
        let base64Image = member.image ? await fetchImageAsBase64(member.image) : "";

        if (base64Image && base64Image.length > 1048576) {
          console.warn(`Skipping member ${member.name}: image size exceeds limit. Setting image to empty string.`);
          base64Image = "";
        }

        const memberData = {
          name: member.name,
          role: member.role,
          image: base64Image,
          date: member.date || "",
        };

        await addDoc(collection(db, "members"), memberData);
      }

      for (const responsable of responsables) {
        let base64Image = responsable.image ? await fetchImageAsBase64(responsable.image) : "";

        if (base64Image && base64Image.length > 1048576) {
          console.warn(`Skipping responsable ${responsable.name}: image size exceeds limit. Setting image to empty string.`);
          base64Image = "";
        }

        const responsableData = {
          name: responsable.name,
          role: responsable.role,
          image: base64Image,
          date: responsable.date || "",
        };

        await addDoc(collection(db, "responsables"), responsableData);
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error adding members/responsables:", err);
      setError("Failed to add all members and responsables.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="dark:bg-gray-700 shadow-lg border border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold dark:text-green-bk text-gray-900 mb-6">
            Add New Member
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Member added successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
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
              <p className="mt-1 text-sm text-gray-500">Max file size: 10MB</p>
            </div>

            <div>
              <label className="block text-sm dark:text-green-bk font-medium text-gray-700">
                Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
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
                {isUploading ? "Uploading..." : "Add Member"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={handleAddAll}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              Add All Members and Responsables
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
