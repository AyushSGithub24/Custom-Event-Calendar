import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Sidebar from "./components/Sidbar/sidbar";
import EventCalendar from "./components/calendar/EventCalendar";
import useEventStore, { useUserStore } from "./stores/eventStore";

function App() {
  const { fetchEvents, loading } = useEventStore();
  console.log(useUserStore.getState().name);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
       {loading && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Loading...
          </div>
        )}
        <EventCalendar />
        <Sidebar />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default App;
