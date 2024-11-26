export default function EventCard({ event, onLearnMore }) {
  return (
    <div
      key={event.id}
      className="relative group w-fit place-items-center overflow-hidden  rounded-lg shadow-lg"
    >
      <img
        src={event.image}
        alt={event.title}
        className=" h-[295px]  transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
        <h3 className="text-xl flex-1 flex justify-center items-center font-bold mb-2">
          {event.title}
        </h3>
        <div className="w-full  flex justify-between items-center">
          <span className="px-3 py-1 bg-green-bk rounded-full text-sm">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          <button
            onClick={onLearnMore}
            className="bg-white text-green-bk px-4 py-2 rounded-lg hover:bg-green-bk hover:text-white transition-colors duration-300"
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}
