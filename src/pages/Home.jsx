import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import home from "../assets/home.png";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function Home() {
  const [lastEvents, setLastEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const now = Timestamp.now();

        // Calculate current event's end date (date + duration in days)
        const currentEventQuery = query(
          eventsRef,
          where("date", "<=", now),
          orderBy("date", "desc"),
          limit(1)
        );
        const currentEventSnapshot = await getDocs(currentEventQuery);
        
        let currentEventToAdd = null;

        if (!currentEventSnapshot.empty) {
          const eventData = currentEventSnapshot.docs[0].data();
          const startDate = new Date(eventData.date.seconds * 1000);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + eventData.duration);
          
          // Only set as current event if it hasn't ended yet
          if (endDate > new Date()) {
            const currentEventData = {
              id: currentEventSnapshot.docs[0].id,
              ...eventData,
              date: startDate.toLocaleDateString('fr-FR'),
              endDate: endDate
            };
            setCurrentEvent(currentEventData);
            currentEventToAdd = null; // Reset currentEventToAdd since it's a current event
          } else {
            // If event has ended, prepare it to be added to lastEvents
            currentEventToAdd = {
              id: currentEventSnapshot.docs[0].id,
              ...eventData,
              date: startDate.toLocaleDateString('fr-FR')
            };
          }
        }

        // Fetch last events, excluding current event if it exists
        const lastEventsQuery = query(
          eventsRef,
          where("date", "<", now),
          orderBy("date", "desc"),
          limit(currentEventToAdd ? 5 : 6)
        );
        const lastEventsSnapshot = await getDocs(lastEventsQuery);
        let lastEventsData = lastEventsSnapshot.docs
          .filter(doc => !currentEvent || doc.id !== currentEvent.id) // Exclude current event
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: new Date(doc.data().date.seconds * 1000).toLocaleDateString('fr-FR'),
          }));

        // Add the ended current event to lastEvents if it exists
        if (currentEventToAdd) {
          lastEventsData = [currentEventToAdd, ...lastEventsData.slice(0, -1)];
        }

        setLastEvents(lastEventsData);

        // Fetch next event (events with start date after now)
        const nextEventQuery = query(
          eventsRef,
          where("date", ">", now),
          orderBy("date", "asc"),
          limit(1)
        );
        const nextEventSnapshot = await getDocs(nextEventQuery);
        if (!nextEventSnapshot.empty) {
          const nextEventData = {
            id: nextEventSnapshot.docs[0].id,
            ...nextEventSnapshot.docs[0].data(),
            date: new Date(
              nextEventSnapshot.docs[0].data().date.seconds * 1000
            ).toLocaleDateString('fr-FR'),
          };
          setNextEvent(nextEventData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Check event status every minute
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === lastEvents.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? lastEvents.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <img
          src={home}
          className="w-full h-auto object-cover"
          alt="Home banner"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 px-4">
          <h1 className="uppercase text-center text-white font-semibold mb-2 sm:text-6xl md:text-7xl lg:mb-6 text-3xl lg:text-8xl">
            Badrat Khayr Club
          </h1>
          <h3 className="text-center text-white sm:text-5xl md:text-6xl font-semibold text-lg lg:text-6xl">
            A journey of a thousand miles begins with a single step
          </h3>
        </div>
      </div>

      {currentEvent && (
        <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24 lg:my-32">
          <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
            Current Event
          </h1>
          <div className="flex flex-col md:flex-row gap-4 lg:gap-20 justify-evenly items-center">
            <div className="relative w-48 sm:w-72 md:w-96 lg:w-[34rem] mt-5 sm:mt-2">
              <div className="absolute w-full h-full rounded-tl-lg rounded-br-lg border border-1 border-dark-one7 left-4 top-4 z-0"></div>
              <img
                src={currentEvent.image}
                className="w-full h-auto object-cover rounded-tl-lg rounded-br-lg z-10 relative"
                alt={currentEvent.title}
              />
            </div>
            <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
              <h1 className="text-lg sm:text-3xl text-green-bk lg:text-5xl pb-5">
                {currentEvent.title}
              </h1>
              <h4 className="text-md sm:text-xl tlg:text-3xl pb-5 text-gray-400">
                {currentEvent.date}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {currentEvent.description}
              </p>
              <Link
                to={`/inscription/${currentEvent.id}`}
                className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {nextEvent && (
        <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24 lg:my-32">
          <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
            Next Event
          </h1>
          <div className="flex flex-col md:flex-row gap-4 lg:gap-20 justify-evenly items-center">
            <div className="relative w-48 sm:w-72 md:w-96 lg:w-[34rem] mt-5 sm:mt-2">
              <div className="absolute w-full h-full rounded-tl-lg rounded-br-lg border border-1 border-dark-one7 left-4 top-4 z-0"></div>
              <img
                src={nextEvent.image}
                className="w-full h-auto object-cover rounded-tl-lg rounded-br-lg z-10 relative"
                alt={nextEvent.title}
              />
            </div>
            <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
              <h1 className="text-lg sm:text-3xl text-green-bk lg:text-5xl pb-5">
                {nextEvent.title}
              </h1>
              <h4 className="text-md sm:text-xl tlg:text-3xl pb-5 text-gray-400">
                {nextEvent.date}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {nextEvent.description}
              </p>
              <Link
                to={`/inscription/${nextEvent.id}`}
                className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition"
              >
                Pre-Register Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {lastEvents.length > 0 && (
        <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24">
          <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
            Our Last Events
          </h1>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {lastEvents.map((event, index) => (
                  <div key={event.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg mx-auto max-w-xl ">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{event.date}</p>
                        <p className="text-gray-700">{event.description}</p>
                        <div className="mt-4">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {event.category.charAt(0).toUpperCase() +
                              event.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            >
              <IoChevronBackOutline className="w-6 h-6 text-green-bk" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            >
              <IoChevronForwardOutline className="w-6 h-6 text-green-bk" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
