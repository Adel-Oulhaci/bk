import { useState, useEffect } from "react";
import { useEvents } from "../context/EventsContext";

export default function History() {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Event's Timeline</h2>
      <div className="lg:hidden">
        <ol className="ml-7 border-l-2 border-green-bk">
          {events.map((event) => (
            <li key={event.id}>
              <div className="flex-start flex">
                <div className="-ml-[18px] flex h-[35px] w-[35px] items-center justify-center rounded-full bg-green-bk text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mb-10 ml-6 block w-full bg-emerald-50 rounded-lg shadow-md p-6 transition-transform hover:shadow-lg hover:cursor-pointer hover:shadow-green-bk">
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm font-medium text-green-bk">
                      {event.title}
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                      {event.date.split('T')[0]}
                    </span>
                  </div>
                  <p className="mb-4 text-neutral-700">{event.description}</p>
                  <div className="flex justify-start">
                    <span className="inline-block bg-emerald-200 text-green-bk px-3 py-1 rounded-full text-sm font-medium">
                      {event.category.charAt(0).toUpperCase() +
                        event.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="hidden lg:block relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-green-bk" />
        <div className="relative flex flex-col gap-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-center gap-8 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-[calc(50%-2.5rem)] ${
                  index % 2 === 0 ? "text-right" : "text-left"
                }`}
              >
                <div className="bg-emerald-50 z-50 rounded-lg shadow-md p-6 transition-transform hover:shadow-lg hover:cursor-pointer hover:shadow-green-bk">
                  <div
                    className={`flex justify-between items-start mb-4 ${
                      index % 2 === 0 ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-green-bk">
                      {event.title}
                    </h3>
                    <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                      {event.date.split('T')[0]}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div
                    className={`flex ${
                      index % 2 === 0 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="inline-block bg-emerald-200 text-green-bk px-3 py-1 rounded-full text-sm font-medium">
                      {event.category.charAt(0).toUpperCase() +
                        event.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative top-[-6rem] w-12 h-12 flex-shrink-0">
                <div className="w-12 h-12 bg-green-bk rounded-full flex items-center justify-center shadow-lg z-10 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {index % 2 === 0 ? (
                  <div className="absolute top-1/2 w-[calc(2.3rem-5px)] h-[2px] bg-green-bk right-full transform -translate-y-1/2"></div>
                ) : (
                  <div className="absolute top-1/2 w-[calc(2.3rem-5px)] h-[2px] bg-green-bk left-full transform -translate-y-1/2"></div>
                )}
              </div>

              <div className="w-[calc(50%-2.5rem)]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
