// import { useState, useEffect } from 'react';
// import { collection, query, orderBy, getDocs, limit, where, Timestamp } from 'firebase/firestore';
// import { db } from '../firebase';
// import { Link } from "react-router-dom";
// import home from "../assets/home.png";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/effect-cards";
// import { EffectCards } from "swiper/modules";

// export default function Home() {
//   const [lastEvents, setLastEvents] = useState([]);
//   const [nextEvent, setNextEvent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventsRef = collection(db, 'events');

//         // Fetch last events
//         const lastEventsQuery = query(eventsRef, orderBy('date', 'desc'), limit(5));
//         const lastEventsSnapshot = await getDocs(lastEventsQuery);
//         const lastEventsData = lastEventsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           date: new Date(doc.data().date.seconds * 1000).toLocaleDateString()
//         }));
//         setLastEvents(lastEventsData);

//         // Fetch next event (future event closest to current date)
//         const now = Timestamp.now();
//         const nextEventQuery = query(
//           eventsRef,
//           where('date', '>=', now),
//           orderBy('date', 'asc'),
//           limit(1)
//         );
//         const nextEventSnapshot = await getDocs(nextEventQuery);
//         if (!nextEventSnapshot.empty) {
//           const nextEventData = {
//             id: nextEventSnapshot.docs[0].id,
//             ...nextEventSnapshot.docs[0].data(),
//             date: new Date(nextEventSnapshot.docs[0].data().date.seconds * 1000).toLocaleDateString()
//           };
//           setNextEvent(nextEventData);
//         }
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="relative">
//         <img src={home} className="w-full" alt="Home banner" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 px-4">
//           <h1 className="uppercase text-center text-white font-semibold mb-2 sm:text-6xl md:text-7xl lg:mb-6 text-3xl lg:text-8xl">
//             Badrat Khayr Club
//           </h1>
//           <h3 className="text-center text-white sm:text-5xl md:text-6xl font-semibold text-lg lg:text-6xl">
//             A journey of a thousand miles begins with a single step
//           </h3>
//         </div>
//       </div>

//       {nextEvent && (
//         <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24 lg:my-32">
//           <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
//             Next Event
//           </h1>
//           <div className="flex flex-col md:flex-row gap-4 lg:gap-40 justify-evenly items-center">
//           <div className="relative w-64 sm:w-96 lg:w-[34rem] mt-5 sm:mt-2">
//             <div className="absolute w-full h-full rounded-tl-lg rounded-br-lg border border-1 border-dark-one7  left-4 top-4 z-0"></div>
//             <img
//               src={nextEvent.image}
//               className="w-full rounded-tl-lg rounded-br-lg z-10 relative"
//               alt={nextEvent.title}
//             />
//           </div>
//           <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
//             <h1 className="text-2xl sm:text-4xl text-green-bk lg:text-6xl pb-5">
//             {nextEvent.title}
//             </h1>
//             <h3 className='text-gray-400 text-lg'>{nextEvent.date}</h3>
//             <p className="text-gray-600  text-sm sm:text-base mb-6">
//             {nextEvent.description}
//             </p>
//             <Link
//                 to={`/inscription/${nextEvent.id}`}
//                 className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition"
//               >
//                 Pre-Register Now
//               </Link>
//           </div>
//         </div>
//       </div>
//           // <div className="flex flex-col md:flex-row gap-4 lg:gap-20 justify-evenly items-center">
//           //   <div className="relative w-48 sm:w-72 md:w-96 lg:w-[34rem] mt-5 sm:mt-2">
//           //     <div className="absolute w-full h-full rounded-tl-lg rounded-br-lg border border-1 border-dark-one7 left-4 top-4 z-0"></div>
//           //     <img
//           //       src={nextEvent.image}
//           //       className="w-full h-64 object-cover rounded-tl-lg rounded-br-lg z-10 relative"
//           //       alt={nextEvent.title}
//           //     />
//           //   </div>
//           //   <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
//           //     <h1 className="text-lg sm:text-3xl text-green-bk lg:text-5xl pb-5">
//           //       {nextEvent.title} -z {nextEvent.date}
//           //     </h1>
//           //     <p className="text-gray-600 text-sm sm:text-base mb-6">
//           //       {nextEvent.description}
//           //     </p>
//           //     <Link
//           //       to={`/inscription/${nextEvent.id}`}
//           //       className="bg-green-bk text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#148563] transition"
//           //     >
//           //       Pre-Register Now
//           //     </Link>
//           //   </div>
//           // </div>
//         //</div>
//       )}

//       <div className="px-4 sm:mx-12 md:mx-24 my-10 md:my-24">
//         <h1 className="text-3xl lg:text-4xl mb-6 text-center font-medium lg:font-semibold">
//           Our Last Events
//         </h1>
//         <div className="flex justify-center items-center">
//         <div className="max-w-[16rem] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">            <Swiper
//               effect={"cards"}
//               grabCursor={true}
//               modules={[EffectCards]}
//               className="mySwiper"
//             >
//               {lastEvents.map((event) => (
//                 <SwiperSlide key={event.id}>
//                   <div className="bg-white rounded-xl overflow-hidden shadow-lg">
//                     <img
//                       src={event.image}
//                       alt={event.title}
//                       className="w-full h-64 object-cover"
//                     />
//                     <div className="p-6">
//                       <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
//                       <p className="text-gray-600 mb-4">{event.date}</p>
//                       <p className="text-gray-700">{event.description}</p>
//                       <div className="mt-4">
//                         <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                           {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from "react-router-dom";
import home from "../assets/home.png";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function Home() {
  const [lastEvents, setLastEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const now = Timestamp.now();

        // Fetch last events (before current date)
        const lastEventsQuery = query(
          eventsRef, 
          where('date', '<', now),
          orderBy('date', 'desc'), 
          limit(5)
        );
        const lastEventsSnapshot = await getDocs(lastEventsQuery);
        const lastEventsData = lastEventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().date.seconds * 1000).toLocaleDateString()
        }));
        setLastEvents(lastEventsData);

        // Fetch next event
        const nextEventQuery = query(
          eventsRef,
          where('date', '>=', now),
          orderBy('date', 'asc'),
          limit(1)
        );
        const nextEventSnapshot = await getDocs(nextEventQuery);
        if (!nextEventSnapshot.empty) {
          const nextEventData = {
            id: nextEventSnapshot.docs[0].id,
            ...nextEventSnapshot.docs[0].data(),
            date: new Date(nextEventSnapshot.docs[0].data().date.seconds * 1000).toLocaleDateString()
          };
          setNextEvent(nextEventData);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
        <img src={home} className="w-full" alt="Home banner" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 px-4">
          <h1 className="uppercase text-center text-white font-semibold mb-2 sm:text-6xl md:text-7xl lg:mb-6 text-3xl lg:text-8xl">
            Badrat Khayr Club
          </h1>
          <h3 className="text-center text-white sm:text-5xl md:text-6xl font-semibold text-lg lg:text-6xl">
            A journey of a thousand miles begins with a single step
          </h3>
        </div>
      </div>

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
                className="w-full h-64 object-cover rounded-tl-lg rounded-br-lg z-10 relative"
                alt={nextEvent.title}
              />
            </div>
            <div className="text-center mt-5 md:mt-0 md:w-1/2 md:text-start">
              <h1 className="text-lg sm:text-3xl text-green-bk lg:text-5xl pb-5">
                {nextEvent.title}  
              </h1>
              <h4 className='text-md sm:text-xl tlg:text-3xl pb-5 text-gray-400'>{nextEvent.date}</h4>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {nextEvent.description}
              </p>
              <Link
                to={`/inscription/${nextEvent.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg mx-auto max-w-4xl">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.date}</p>
                        <p className="text-gray-700">{event.description}</p>
                        <div className="mt-4">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
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