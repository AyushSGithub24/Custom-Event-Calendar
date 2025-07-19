import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  sub,
} from "date-fns";
import { useRef, useState,useEffect } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const years = Array.from({ length: 500 }, (_, i) => 1970 + i);

export default function EventCalender() {
  // You can change this date to test with different months
  const [today] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);

  const [showMonthInput, setShowMonthInput] = useState(false);
  const [showYearInput, setShowYearInput] = useState(false);

  const [monthQuery, setMonthQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");

   const monthRef = useRef(null);
  const yearRef = useRef(null);

  // Outside click detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        monthRef.current &&
        !monthRef.current.contains(e.target) &&
        yearRef.current &&
        !yearRef.current.contains(e.target)
      ) {
        setShowMonthInput(false);
        setShowYearInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMonths = months.filter((m) =>
    m.toLowerCase().includes(monthQuery.toLowerCase())
  );

  const filteredYears = years.filter((y) => y.toString().startsWith(yearQuery));

  const eachDayInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(startOfMonth(newDate));
    setShowMonthInput(false);
    setMonthQuery("");
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(startOfMonth(newDate));
    setShowYearInput(false);
    setYearQuery("");
  };

  const goToNextMonth = () => {
    setCurrentMonth(add(currentMonth, { months: 1 }));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(sub(currentMonth, { months: 1 }));
  };

  const startingDay =
    firstDayOfMonth.getDay() - 1 < 0 ? 6 : firstDayOfMonth.getDay() - 1;

  const emptyDays = Array.from({ length: startingDay }, (_, i) => i + 1);

 


  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 ">
           <button
          onClick={goToPreviousMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={()=>{
          setCurrentMonth(today);
        }}>Today</button>
        </div>
        {/* Month-Year Display */}
        <div className="relative" >
          <h1 className="text-2xl font-bold flex gap-2 items-center">
            {/* Month Display/Input */}
            <div
              className="cursor-pointer hover:underline"
              onClick={() => {
                setShowMonthInput(true);
                setShowYearInput(false);
              }}
            >
              {format(currentMonth, "MMM")}
            </div>

            {/* Year Display/Input */}
            <div
              className="cursor-pointer hover:underline"
              onClick={() => {
                setShowYearInput(true);
                setShowMonthInput(false);
              }}
            >
              {format(currentMonth, "yyyy")}
            </div>
          </h1>

          {/* Month Input Popup */}
          {showMonthInput && (
            <div    ref={monthRef}
            className="absolute bg-white border shadow p-2 w-40 rounded mt-2 z-10">
              <input
                type="text"
                value={monthQuery}
                onChange={(e) => setMonthQuery(e.target.value)}
                placeholder="Type month"
                className="w-full mb-2 px-2 py-1 border rounded"
              />
              <div className="max-h-40 overflow-y-auto">
                {filteredMonths.map((m, idx) => (
                  <div
                    key={m}
                    onClick={() => handleMonthSelect(months.indexOf(m))}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer rounded"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Year Input Popup */}
          {showYearInput && (
            <div ref={yearRef}
            className="absolute bg-white border shadow p-2 w-40 rounded mt-2 z-10">
              <input
                type="text"
                value={yearQuery}
                onChange={(e) => setYearQuery(e.target.value)}
                placeholder="Type year"
                className="w-full mb-2 px-2 py-1 border rounded"
              />
              <div className="max-h-40 overflow-y-auto">
                {filteredYears.map((y) => (
                  <div
                    key={y}
                    onClick={() => handleYearSelect(y)}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer rounded"
                  >
                    {y}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
     

        </div>
        <div className="calendar grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="font-bold text-center">
              {day}
            </div>
          ))}
          {emptyDays.map((_, idx) => (
            <div key={idx} className="p-2 border rounded"></div>
          ))}
          {eachDayInMonth.map((day, idx) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            return (
              <div
                key={idx}
                className={`p-2 border rounded text-center cursor-pointer transition-all 
                ${isSelected ? "bg-blue-500 text-white" : ""}
                ${
                  isTodayDate
                    ? "bg-blue-100 border-blue-500 text-orange-500"
                    : ""
                }
                hover:bg-blue-200`}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
