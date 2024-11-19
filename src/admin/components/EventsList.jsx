const EventsList = ({ events, onSelectEvent, selectedEvent }) => {
  return (
    <div className="space-y-2">
      {events.map(event => (
        <div
          key={event.id}
          className={`p-3 rounded cursor-pointer ${
            selectedEvent?.id === event.id 
              ? 'bg-green-bk text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
          onClick={() => onSelectEvent(event)}
        >
          <h4 className="font-semibold">{event.title}</h4>
          <p className="text-sm">
            {event.date.toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventsList; 