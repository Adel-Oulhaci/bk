import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, convertImageToBase64 } from "../../firebase";

const UpdateMember = () => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("members");
  const [selectedItemId, setSelectedItemId] = useState(id);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCollectionData = async (collectionName, setState) => {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      const itemsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState(itemsList);
    };

    fetchCollectionData("members", setMembers);
    fetchCollectionData("responsables", setResponsables);
    fetchCollectionData("menu", setMenuItems);
  }, []);

  useEffect(() => {
    const fetchItemData = async () => {
      const docRef = doc(db, selectedCategory, selectedItemId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setFormData(docSnapshot.data());
      } else {
        setError("Item not found");
      }
    };

    if (selectedItemId) {
      fetchItemData();
    }
  }, [selectedItemId, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItemId(""); // Reset selected item when category changes
  };

  const handleItemChange = (e) => {
    setSelectedItemId(e.target.value);
  };

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
        setError("File size must be less than 5MB");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsUploading(true);

    try {
      const docRef = doc(db, selectedCategory, selectedItemId);
      const updateData = {
        name: formData.name,
        role: formData.role,
      };

      // Only update image if a new one is provided
      if (formData.image && typeof formData.image === 'object') {
        const base64Image = await convertImageToBase64(formData.image);
        if (base64Image.length > 1048576) {
          setError("Image size exceeds the limit after resizing.");
          return;
        }
        updateData.image = base64Image;
      }

      // Only update date if it's changed
      if (formData.date && formData.date !== (await getDoc(docRef)).data().date) {
        updateData.date = formData.date;
      }

      await updateDoc(docRef, updateData);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to update member:", err);
      setError("Failed to update member. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="dark:bg-gray-700 shadow-lg border border-emerald-100 dark:border-gray-600 dark:shadow-none shadow-emerald-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold dark:text-green-bk text-gray-900 mb-6">
            Update Item
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Item updated successfully!
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
            >
              <option value="members">Members</option>
              <option value="responsables">Responsables</option>
              <option value="menu">Menu</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
              Select Item
            </label>
            <select
              value={selectedItemId}
              onChange={handleItemChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
            >
              {(selectedCategory === "members" ? members : selectedCategory === "responsables" ? responsables : menuItems).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name || item.title}
                </option>
              ))}
            </select>
          </div>

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
                placeholder="Enter name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold dark:file:bg-gray-600 dark:file:text-green-bk file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 text-white font-semibold rounded-md ${
                  isUploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={isUploading}
              >
                {isUploading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default UpdateMember;
