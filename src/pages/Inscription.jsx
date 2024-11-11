import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import FormRegister from "../components/FormRegister";

export default function Inscription() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) {
          setError("No event specified");
          return;
        }

        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (!eventDoc.exists()) {
          setError("Event not found");
          return;
        }

        setEvent({
          id: eventDoc.id,
          ...eventDoc.data(),
          date: new Date(eventDoc.data().date.seconds * 1000).toLocaleDateString()
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <img src={event.image} className="w-full h-64 sm:h-[400px] md:h-[600px] object-cover blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2">
          <h1 className="uppercase text-center text-white font-semibold mb-1 sm:text-6xl md:text-7xl lg:mb-6 text-xl lg:text-8xl">
            {event.title}
          </h1>
          <h3 className="text-center text-white sm:text-5xl md:text-6xl font-semibold text-lg lg:text-6xl">
            Registration Form
          </h3>
          <p className="text-center text-white mt-4 text-xl">
            Event Date: {event.date}
          </p>
        </div>
      </div>
      <FormRegister eventId={eventId} />
    </>
  );
}