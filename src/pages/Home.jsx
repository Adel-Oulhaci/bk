import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import home from "../assets/home.png";

import { useEvents } from "../context/EventsContext";

export default function Home() {
  const { events, loading, stats } = useEvents();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!events.length) return;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    let current = null;
    let next = null;
    let last = null;

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const endDate = new Date(eventDate);
      endDate.setDate(eventDate.getDate() + (parseInt(event.duration) - 1));

      if (today >= event.date && today <= endDate.toISOString().slice(0, 10)) {
        current = event;
      } else if (event.date > today && (!next || event.date < next.date)) {
        next = event;
      } else if (endDate.toISOString().slice(0, 10) < today) {
        if (!last || new Date(event.date) > new Date(last.date)) {
          last = event;
        }
      }
    });

    setCurrentEvent(current);
    setNextEvent(next);
    setLastEvent(last);
  }, [events]);

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

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-bk mb-2">
                {stats.totalMembers}
              </div>
              <div className="text-gray-600">Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-bk mb-2">
                {stats.totalEvents}
              </div>
              <div className="text-gray-600">Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-bk mb-2">
                {stats.totalSubscribed}
              </div>
              <div className="text-gray-600">Event's Registrations</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24 lg:my-32">
        <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
          Next Event
        </h1>
        <div className="flex flex-col md:flex-row gap-4 lg:gap-20 justify-evenly items-center">
          <div className="relative w-48 sm:w-72 md:w-96 lg:w-[34rem] mt-5 sm:mt-2">
            <div className="absolute w-full h-full rounded-tl-lg rounded-br-lg border border-1 border-dark-one7 left-4 top-4 z-0"></div>
            <img
              src={nextEvent ? nextEvent.image : home}
              className="w-full h-auto object-cover rounded-tl-lg rounded-br-lg z-10 relative"
              alt={nextEvent ? nextEvent.title : "Coming Soon"}
            />
          </div>
          <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
            <h1 className="text-lg sm:text-3xl text-green-bk lg:text-5xl pb-5">
              {nextEvent ? nextEvent.title : "Coming Soon"}
            </h1>
            <h4 className="text-md sm:text-xl tlg:text-3xl pb-5 text-gray-400">
              {nextEvent ? nextEvent.date.split("T")[0] : "To be announced"}
            </h4>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              {nextEvent
                ? nextEvent.description
                : "Stay tuned for our next exciting event! We are preparing something special for you."}
            </p>
            {nextEvent ? (
              <Link
                to={`/inscription/${nextEvent.id}`}
                className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition"
              >
                Pre-Register Now
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Pre-Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {currentEvent ? (
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
                {currentEvent.date.split("T")[0]}
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
      ) : null}

      {lastEvent && (
        <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24">
          <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
            Our Last Event
          </h1>
          <div className="bg-white rounded-xl overflow-hidden shadow-lg mx-auto max-w-xl">
            <img
              src={lastEvent.image}
              alt={lastEvent.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{lastEvent.title}</h3>
              <p className="text-gray-600 mb-4">
                {lastEvent.date.split("T")[0]}
              </p>
              <p className="text-gray-700">{lastEvent.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {lastEvent.category.charAt(0).toUpperCase() +
                    lastEvent.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
