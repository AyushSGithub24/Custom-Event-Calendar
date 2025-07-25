import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { EventSidebar } from "./eventSidebar";
import useEventStore, { useUserStore } from "../../stores/eventStore";

const toDatetimeLocal = (date) => {
  const local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toISOString().slice(0, 16);
};

const readableRecurrence = (rule) => {
  if (!rule) return "";
  if (rule.includes("FREQ=DAILY")) return "Daily";
  if (rule.includes("FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR")) return "Weekdays";
  if (rule.includes("FREQ=WEEKLY;BYDAY=SA,SU")) return "Weekends";
  if (rule.includes("FREQ=WEEKLY")) return "Weekly";
  if (rule.includes("FREQ=MONTHLY")) return "Monthly";
  if (rule.includes("FREQ=YEARLY")) return "Yearly";
  return rule; // fallback
};

export default function Sidebar() {
  const {
    isSidebarOpen,
    sidebarEventData,
    events,
    setSidebarOpen,
    saveEvent,
    handleEditEvent,
    deleteEvent,
  } = useEventStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: toDatetimeLocal(new Date()),
    end: toDatetimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
    isRecurring: false,
    recurrenceRule: "",
  });

  useEffect(() => {
    if (sidebarEventData) {
      setFormData({
        ...sidebarEventData,
        start: toDatetimeLocal(new Date(sidebarEventData.start)),
        end: toDatetimeLocal(new Date(sidebarEventData.end)),
      });
    }
  }, [sidebarEventData]);

  // TODO: Replace this with actual session/user store
  const name = (useUserStore((state) => state.name)) || "Ayush Gupta";
  const {handleLogout} = useEventStore();

  return (
    <div className="bg-gray-50 text-gray-800 w-full min-h-screen font-sans">
      <EventSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSave={saveEvent}
        eventData={formData}
        setFormData={setFormData}
      />

      <div className="p-6">
        <header className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold text-gray-900"> {name.split(" ")[0]}'s Calendar</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#e87030] hover:hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
            >
              Logout
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-[#588baa] hover:hover:bg-[#557990] text-white font-medium py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
            >
              <Plus size={18} />
              Add Event
            </button>
          </div>
        </header>

        <main className="bg-white p-6 rounded-xl shadow-md ">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-500">
              No events yet. Add one to get started!
            </p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
              <ul>
                {events.map((event) => (
                  <li
                    key={event._id}
                    className="bg-gray-100 p-4 rounded-lg border border-gray-200 mb-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.start).toLocaleString()} –{" "}
                          {new Date(event.end).toLocaleString()}
                        </p>
                        {event.description && (
                          <p className="text-sm mt-2 text-gray-700">
                            {event.description}
                          </p>
                        )}
                        {event.recurrenceRule && (
                          <p className="text-xs mt-1 text-indigo-600 font-mono">
                            Recurs: {readableRecurrence(event.recurrenceRule)}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteEvent(event)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
