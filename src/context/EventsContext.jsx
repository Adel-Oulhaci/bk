import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalSubscribed: 0,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const eventsRef = collection(db, "events");
        const membersRef = collection(db, "members");
        const responsablesRef = collection(db, "responsables");
        const registrationsRef = collection(db, "registrations");

        // Fetch all data in parallel
        const [eventsSnapshot, membersSnapshot, responsablesSnapshot, registrationsSnapshot] = 
          await Promise.all([
            getDocs(query(eventsRef, orderBy("date", "desc"))),
            getDocs(membersRef),
            getDocs(responsablesRef),
            getDocs(registrationsRef)
          ]);

        // Process events data
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date,
          formattedDate: new Date(doc.data().date).toLocaleDateString("fr-FR").slice(0,10),
        }));

        // Set events
        setEvents(eventsData);

        // Set stats
        setStats({
          totalMembers: membersSnapshot.size + responsablesSnapshot.size,
          totalEvents: eventsSnapshot.size,
          totalSubscribed: 10000 + registrationsSnapshot.size,
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, error, stats }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
} 