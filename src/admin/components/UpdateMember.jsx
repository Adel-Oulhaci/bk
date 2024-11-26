import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db, convertImageToBase64 } from "../../firebase";

const UpdateMember = () => {
  const { id } = useParams(); // Get the member ID from the URL
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(id);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "", // Initialize image as an empty string
    date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersList);
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      const memberDoc = doc(db, "members", selectedMemberId);
      const memberSnapshot = await getDoc(memberDoc);
      if (memberSnapshot.exists()) {
        setFormData(memberSnapshot.data());
      } else {
        setError("Member not found");
      }
    };

    if (selectedMemberId) {
      fetchMemberData();
    }
  }, [selectedMemberId]);

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

    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    try {
      setIsUploading(true);
      const base64Image = await convertImageToBase64(formData.image);

      const memberData = {
        name: formData.name,
        role: formData.role,
        image: base64Image,
        date: formData.date,
      };

      const memberDoc = doc(db, "members", selectedMemberId);
      await updateDoc(memberDoc, memberData);
      setSuccess(true);
      setFormData({ name: "", role: "", image: "", date: "" });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
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
            Update Member
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Member updated successfully!
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-green-bk text-gray-700">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-offset-1 focus:ring focus:ring-green-bk"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
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
              <p className="mt-1 text-sm text-gray-500">Max file size: 5MB</p>
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
                {isUploading ? "Updating..." : "Update Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;
