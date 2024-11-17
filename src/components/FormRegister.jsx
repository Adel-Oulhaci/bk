import { useState } from "react";
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import QRCode from 'qrcode';
import { formFields } from "../services/Details";

const FormRegister = ({ eventId }) => {
  const [formData, setFormData] = useState({
    firstn: "",
    lastn: "",
    email: "",
    phone: "",
    academiclevel: "",
    speciality: "",
    faculty: "",
  });

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${formData.firstn}-${formData.lastn}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkExistingRegistration = async () => {
    const registrationsRef = collection(db, 'registrations');
    
    const emailQuery = query(
      registrationsRef, 
      where('eventId', '==', eventId),
      where('email', '==', formData.email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      throw new Error('This email is already registered for this event');
    }

    const nameQuery = query(
      registrationsRef,
      where('eventId', '==', eventId),
      where('firstn', '==', formData.firstn),
      where('lastn', '==', formData.lastn)
    );
    const nameSnapshot = await getDocs(nameQuery);
    if (!nameSnapshot.empty) {
      throw new Error('This name is already registered for this event');
    }
  };

  const generateQRCode = async (registrationData) => {
    try {
      const qrData = JSON.stringify({
        registrationId: registrationData.id,
        name: `${registrationData.firstn} ${registrationData.lastn}`,
        email: registrationData.email,
        eventId: registrationData.eventId,
        timestamp: registrationData.timestamp
      });
      
      const qrCodeImage = await QRCode.toDataURL(qrData);
      return qrCodeImage;
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw new Error('Failed to generate QR code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await checkExistingRegistration();

      const registrationData = {
        ...formData,
        eventId,
        timestamp: Timestamp.now(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, 'registrations'), registrationData);
      
      const qrCodeImage = await generateQRCode({
        id: docRef.id,
        ...registrationData
      });

      await addDoc(collection(db, 'registrations', docRef.id, 'qrcodes'), {
        code: qrCodeImage,
        createdAt: Timestamp.now()
      });

      setQrCode(qrCodeImage);
      setMessage("Registration successful! Your QR code has been generated and downloaded.");
      setShowModal(true);
      downloadQRCode();

      setFormData({
        firstn: "",
        lastn: "",
        email: "",
        phone: "",
        academiclevel: "",
        speciality: "",
        faculty: "",
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally { 
      setLoading(false);
    }
  }; 

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-green-bk mb-2">
        Register Now!
      </h1>
      <p className="text-center text-gray-600 mb-8">
        to participate in this event.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6"
      >
        {formFields.map((field) => (
          <div key={field.id} className="col-span-2">
            <div className="flex justify-between">
              <label
                htmlFor={field.id}
                className="text-gray-700 font-semibold mb-1"
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <label
                htmlFor={field.id}
                className="text-gray-700 font-semibold mb-1"
              >
                {field.required && <span className="text-red-500">*</span>}{" "}
                {field.arabicLabel}
              </label>
            </div>
            <input
              required={field.required}
              type={field.type}
              id={field.id}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#18A67A]"
              disabled={loading}
            />
          </div>
        ))}
        <div className="text-center col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-green-bk mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            {qrCode && (
              <div className="flex flex-col items-center mb-4">
                <img src={qrCode} alt="Registration QR Code" className="w-48 h-48 mb-4" />
                <button
                  onClick={downloadQRCode}
                  className="bg-green-bk text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#148563] transition mb-4"
                >
                  Download QR Code
                </button>
              </div>
            )}
            <div className="text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormRegister;