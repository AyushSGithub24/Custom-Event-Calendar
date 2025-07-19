import {  useState } from "react";
import {add,sub} from "date-fns";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

// --- Main Parent Component: EventCalendar ---
export default function EventCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    

    const handleDateSelect = (day) => {
        setSelectedDate(day);
        // This is where you will trigger the modal to add an event
        console.log("Selected date:", day);
    };

    const handleMonthSelect = (monthIndex) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    };

    const handleYearSelect = (year) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    };

    return (
     
            <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
                <CalendarHeader 
                    currentMonth={currentMonth}
                    onNextMonth={() => setCurrentMonth(add(currentMonth, { months: 1 }))}
                    onPrevMonth={() => setCurrentMonth(sub(currentMonth, { months: 1 }))}
                    onGoToToday={() => {
                        setCurrentMonth(new Date());
                        setSelectedDate(new Date());
                    }}
                    onMonthSelect={handleMonthSelect}
                    onYearSelect={handleYearSelect}
                />
                <CalendarGrid 
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                />
            </div>
   
    );
}