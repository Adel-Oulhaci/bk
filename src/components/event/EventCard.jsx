import { Calendar } from 'lucide-react';

export default function EventCard({ event, onLearnMore }) {
  return (
    <div className="bg-white rounded-xl h-min shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-green-bk" />
            <span className="text-sm font-medium text-gray-700">{event.date}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-green-100 text-green-bk px-3 py-1 rounded-full text-sm font-medium">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          <button onClick={onLearnMore} className="text-green-bk font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}
 