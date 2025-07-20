import { useEffect, useState } from "react";
import { RRule } from "rrule";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import Sidebar from "./components/Sidbar/sidbar";
import EventCalendar from "./components/calendar/EventCalendar";
import { set } from "date-fns";



function App() {
  const [events, setEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarEventData, setSidebarEventData] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Open sidebar with selected date
  const handleDateClick = (date) => {
    setSidebarEventData({
      title: "",
      description: "",
      start: toDatetimeLocal(date),
      end: toDatetimeLocal(new Date(date.getTime() + 60 * 60 * 1000)), // +1 houro
      isRecurring: false,
      recurrenceRule: "",
    });
    setIsSidebarOpen(true);
  };

  // Save event
  const handleSaveEvent = async (eventData) => {
    try {
      let response, savedEvent;

      console.log("Saving event:", eventData);

      if (eventData._id) {
        // Edit mode: PUT request
        response = await fetch(
          `http://localhost:3000/api/v1/events/${eventData._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(eventData),
          }
        );

        if (!response.ok)
          throw new Error(
            (await response.json()).error || "Failed to update event"
          );

        savedEvent = await response.json();

        setEvents(
          events.map((ev) => (ev._id === savedEvent._id ? savedEvent : ev))
        );
      } else {
        // Add mode: POST request
        response = await fetch("http://localhost:3000/api/v1/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(eventData),
        });

        if (!response.ok)
          throw new Error(
            (await response.json()).error || "Failed to add event"
          );

        savedEvent = await response.json();
        setEvents([...events, savedEvent]);
      }

      setIsSidebarOpen(false);
      setSidebarEventData(null); // reset form after saving
    } catch (err) {
     toast.error('Error saving event: ' + err.message);
    }
  };

  const handleEditEvent = (event) => {
    setSidebarEventData({
      ...event,
      start: toDatetimeLocal(new Date(event.start)),
      end: toDatetimeLocal(new Date(event.end)),
    });
    setIsSidebarOpen(true);
  };

  const handleDeleteEvent = async (eventToDelete) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/events/${eventToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      // remove from UI
      setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/events", {
          credentials: "include", // Important for session/cookie auth
        });
        if (!response.ok) {
          let errorMsg = "Failed to fetch events";
          try {
            const error = await response.json();
            errorMsg = error.error || errorMsg;
          } catch (e) {
            errorMsg = response.statusText;
          }
          throw new Error(errorMsg);
        }
        const data = await response.json();
        const allEvents = [...data];
        data
          .filter((ev) => ev.isRecurring && ev.recurrenceRule)
          .forEach((ev) => {
            allEvents.push(...expandRecurringEvents(ev));
          });

        setEvents(data);
        setCalendarEvents(allEvents);
      } catch (err) {
        toast.error('Error fetching events: ' + err.message);
      }
    };
    fetchEvents();
  }, []);

  // Helper for datetime-local input
  function toDatetimeLocal(date) {
    const local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toISOString().slice(0, 16);
  }


const handleEventDrop = async ({ id, start, end }) => {
  try {
    const updatedData = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    const res = await fetch(`http://localhost:3000/api/v1/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update event");

    const updatedEvent = await res.json();
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
    toast.success("Event rescheduled!");
  } catch (err) {
    toast.error("Error updating event: " + err.message);
  }
};



  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <EventCalendar events={calendarEvents} onDateClick={handleDateClick} handleEventDrop={handleEventDrop} />
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onSaveEvent={handleSaveEvent}
          sidebarEventData={sidebarEventData}
          events={events}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

const expandRecurringEvents = (recurringEvent) => {
  const options = RRule.parseString(recurringEvent.recurrenceRule);
  options.dtstart = new Date(recurringEvent.start);

  const rule = new RRule(options);

  return rule
    .between(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) // 365 days
    .map((date) => ({
      ...recurringEvent,
      start: date,
      end: new Date(
        date.getTime() +
          (new Date(recurringEvent.end) - new Date(recurringEvent.start))
      ),
      isExpanded: true,
    }));
};


export default App;
