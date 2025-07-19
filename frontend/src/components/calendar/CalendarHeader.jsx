import {
  add,
  format,
  sub,
} from "date-fns";
import { useRef, useState,useEffect } from "react";
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const years = Array.from({ length: 500 }, (_, i) => 1970 + i);

export function CalendarHeader({ currentMonth,onNextMonth, onPrevMonth, onGoToToday, onMonthSelect, onYearSelect }) {
    const [showMonthPopup, setShowMonthPopup] = useState(false);
    const [showYearPopup, setShowYearPopup] = useState(false);
    const [monthQuery, setMonthQuery] = useState("");
    const [yearQuery, setYearQuery] = useState("");
    const popupContainerRef = useRef(null);

    const filteredMonths = months.filter((m) => m.toLowerCase().includes(monthQuery.toLowerCase()));
    const filteredYears = years.filter((y) => y.toString().startsWith(yearQuery));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setShowMonthPopup(false);
                setShowYearPopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMonthSelect = (monthIndex) => {
        onMonthSelect(monthIndex);
        setShowMonthPopup(false);
        setMonthQuery("");
    };

    const handleYearSelect = (year) => {
        onYearSelect(year);
        setShowYearPopup(false);
        setYearQuery("");
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-t-lg  ">
            <div className="flex items-center gap-2">
                <button onClick={onPrevMonth} className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">prev</button>
                <button onClick={onGoToToday} className="px-4 py-2 font-semibold text-white bg-[#588baa] border border-transparent rounded-lg shadow-sm hover:bg-[#557990]">Today</button>
            </div>
          
            <div className="relative" ref={popupContainerRef}>
                <div className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="cursor-pointer hover:text-[#557990] p-1" onClick={() => { setShowMonthPopup(!showMonthPopup); setShowYearPopup(false); }}>
                        {format(currentMonth, "MMMM")}
                    </span>
                    <span className="cursor-pointer hover:text-[#557990] p-1" onClick={() => { setShowYearPopup(!showYearPopup); setShowMonthPopup(false); }}>
                        {format(currentMonth, "yyyy")}
                    </span>
                </div>

                {showMonthPopup && (
                    <div className="absolute z-10 bg-white border shadow-lg p-2 mt-2 w-48 rounded-md -translate-x-1/4">
                        <input type="text" value={monthQuery} onChange={(e) => setMonthQuery(e.target.value)} placeholder="Search month..." className="w-full mb-2 px-2 py-1 border rounded-md"/>
                        <div className="max-h-48 overflow-y-auto">
                            {filteredMonths.map((m) => (
                                <div key={m} onClick={() => handleMonthSelect(months.indexOf(m))} className="px-2 py-1 hover:bg-indigo-100 cursor-pointer rounded-md">{m}</div>
                            ))}
                        </div>
                    </div>
                )}

                {showYearPopup && (
                    <div className="absolute z-10 bg-white border shadow-lg p-2 mt-2 w-48 rounded-md -translate-x-1/4">
                        <input type="text" value={yearQuery} onChange={(e) => setYearQuery(e.target.value)} placeholder="Search year..." className="w-full mb-2 px-2 py-1 border rounded-md"/>
                        <div className="max-h-48 overflow-y-auto">
                            {filteredYears.map((y) => (
                                <div key={y} onClick={() => handleYearSelect(y)} className="px-2 py-1 hover:bg-indigo-100 cursor-pointer rounded-md">{y}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          
            <button onClick={onNextMonth} className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">next</button>
        </div>
    );
}
