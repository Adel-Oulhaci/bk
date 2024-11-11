import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, convertImageToBase64 } from '../firebase';
import { Calendar } from 'lucide-react';

const categories = ['education', 'charity', 'informatique', 'workshops', 'hiking', 'games'];

export default function AdminPanel() {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError("Please select an image");
      return;
    }

    try {
      setIsUploading(true);

      // Convert image to base64
      const base64Image = await convertImageToBase64(image);

      // Create event document with base64 image
      const eventData = {
        title: newEvent.title,
        date: Timestamp.fromDate(new Date(newEvent.date)),
        category: newEvent.category,
        image: base64Image,
        description: newEvent.description,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'events'), eventData);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setNewEvent({
        title: '',
        date: '',
        category: '',
        description: ''
      });
      setImage(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setError(error.message || 'Failed to add event. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        e.target.value = '';
        return;
      }
      
      setImage(file);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
            <Calendar className="h-6 w-6 text-green-bk" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-bk focus:outline-none focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Event Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-bk focus:outline-none focus:ring-green-bk"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={newEvent.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-bk focus:outline-none focus:ring-green-bk"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-bk focus:outline-none focus:ring-green-bk"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Max file size: 5MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-bk focus:outline-none focus:ring-green-bk"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-bk hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-bk disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add Event'}
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