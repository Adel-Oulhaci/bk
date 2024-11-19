import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditModal from "./EditModal";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

const RegistrationsList = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId)
      );
      const querySnapshot = await getDocs(q);
      const regs = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Generate encoded QR code if not exists
        if (!data.encodedQR) {
          const encodedId = uuidv4();
          const qrCode = await QRCode.toDataURL(encodedId);
          return {
            id: doc.id,
            ...data,
            encodedQR: qrCode,
            qrId: encodedId
          };
        }
        return {
          id: doc.id,
          ...data
        };
      }));
      setRegistrations(regs);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = (updatedUser) => {
    setRegistrations(registrations.map(reg => 
      reg.id === updatedUser.id ? updatedUser : reg
    ));
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "registrations", userId));
      setRegistrations(registrations.filter(reg => reg.id !== userId));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        registrations.map(reg => deleteDoc(doc(db, "registrations", reg.id)))
      );
      setRegistrations([]);
      setShowDeleteAllConfirm(false);
    } catch (error) {
      console.error("Error deleting all registrations:", error);
    }
  };

  if (loading) {
    return <div>Loading registrations...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowDeleteAllConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete All
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-green-bk text-white">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">QR Code</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map(reg => (
            <tr key={reg.id} className="border-b">
              <td className="px-6 py-4">{reg.firstn} {reg.lastn}</td>
              <td className="px-6 py-4">{reg.email}</td>
              <td className="px-6 py-4">{reg.phone}</td>
              <td className="px-6 py-4">
                <img 
                  src={reg.encodedQR} 
                  alt="QR Code"
                  className="w-30 h-30" 
                />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(reg)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => {
                    setUserToDelete(reg);
                    setShowDeleteConfirm(true);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={handleUpdate}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this registration?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete All</h3>
            <p>Are you sure you want to delete all registrations for this event?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsList; 