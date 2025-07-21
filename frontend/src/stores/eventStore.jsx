import { create } from 'zustand';
import { RRule } from "rrule";
import { toast } from 'react-toastify';

const url=import.meta.env.VITE_API_BASE_URL;

export const useUserStore = create((set, get) => ({
  name: "",
  updateName: (newName) => set({ name: newName }),
  getName: () => get().name,
}));


const useEventStore = create((set, get) => ({
  // State
  events: [],
  calendarEvents: [],
  sidebarEventData: null,
  isSidebarOpen: false,
  loading: false,
  error: null,

  // Helper function for datetime-local input
  toDatetimeLocal: (date) => {
    const local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toISOString().slice(0, 16);
  },

  // Expand recurring events
  expandRecurringEvents: (recurringEvent) => {
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
  },

  // Actions
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  setSidebarEventData: (data) => set({ sidebarEventData: data }),

  // Fetch events from API
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(url+"/api/v1/events", {
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
      
      // Process recurring events
      data
        .filter((ev) => ev.isRecurring && ev.recurrenceRule)
        .forEach((ev) => {
          allEvents.push(...get().expandRecurringEvents(ev));
        });

      set({ 
        events: data, 
        calendarEvents: allEvents, 
        loading: false 
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error('Error fetching events: ' + err.message);
    }
  },

  // Handle date click (open sidebar with selected date)
  handleDateClick: (date) => {
    const { toDatetimeLocal, setSidebarOpen, setSidebarEventData } = get();
    setSidebarEventData({
      title: "",
      description: "",
      start: toDatetimeLocal(date),
      end: toDatetimeLocal(new Date(date.getTime() + 60 * 60 * 1000)), // +1 hour
      isRecurring: false,
      recurrenceRule: "",
    });
    setSidebarOpen(true);
  },

  // Save event (create or update)
  saveEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      let response, savedEvent;

      console.log("Saving event:", eventData);

      if (eventData._id) {
        // Edit mode: PUT request
        response = await fetch(
          `${url}/api/v1/events/${eventData._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(eventData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update event");
        }

        savedEvent = await response.json();

        // Update events array
        set((state) => ({
          events: state.events.map((ev) => 
            ev._id === savedEvent._id ? savedEvent : ev
          ),
          loading: false
        }));
      } else {
        // Add mode: POST request
        response = await fetch(url+"/api/v1/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to add event");
        }

        savedEvent = await response.json();
        
        // Add new event to array
        set((state) => ({
          events: [...state.events, savedEvent],
          loading: false
        }));
      }

      // Close sidebar and reset form
      set({ 
        isSidebarOpen: false, 
        sidebarEventData: null 
      });

      // Refresh calendar events with the new/updated event
      get().fetchEvents();

    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error('Error saving event: ' + err.message);
    }
  },

  // Handle edit event
  handleEditEvent: (event) => {
    const { toDatetimeLocal } = get();
    set({
      sidebarEventData: {
        ...event,
        start: toDatetimeLocal(new Date(event.start)),
        end: toDatetimeLocal(new Date(event.end)),
      },
      isSidebarOpen: true
    });
  },

  // Delete event
  deleteEvent: async (eventToDelete) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${url}/api/v1/events/${eventToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      // Remove from UI
      set((state) => ({
        events: state.events.filter((e) => e._id !== eventToDelete._id),
        calendarEvents: state.calendarEvents.filter((e) => e._id !== eventToDelete._id),
        loading: false
      }));

      toast.success("Event deleted successfully!");
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Error deleting event:", err);
      toast.error("Error deleting event: " + err.message);
    }
  },

  handleLogout:  async () => {
      try {
        await fetch(url+"/logout", {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "/"; // or redirect to login
      } catch (err) {
        console.error("Logout failed", err);
      }
  },

  // Handle event drop (drag and drop)
  handleEventDrop: async ({ id, start, end }) => {
    set({ loading: true, error: null });
    try {
      const updatedData = {
        start: start.toISOString(),
        end: end.toISOString(),
      };

      const res = await fetch(`${url}/api/v1/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const updatedEvent = await res.json();
      
      set((state) => ({
        events: state.events.map((ev) => 
          ev._id === updatedEvent._id ? updatedEvent : ev
        ),
        calendarEvents: state.calendarEvents.map((ev) => 
          ev._id === updatedEvent._id ? updatedEvent : ev
        ),
        loading: false
      }));

      toast.success("Event rescheduled!");
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error("Error updating event: " + err.message);
    }
  },
}));



export default useEventStore;
