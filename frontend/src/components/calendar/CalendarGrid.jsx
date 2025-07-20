import { eachDayOfInterval, endOfMonth, isSameDay, isToday, startOfMonth,format } from "date-fns";
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function CalendarGrid({ currentMonth, selectedDate, onDateSelect, events = [] }) {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);    
    const eachDayInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    const startingDayIndex = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    const emptyDays = Array.from({ length: startingDayIndex });

     // Helper: check if a day has events
    const hasEvent = (day) =>
        events.some(ev => format(new Date(ev.start), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));


    return (
        <div className="p-2">
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b">
                {weekDays.map((day) => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {emptyDays.map((_, idx) => <div key={`empty-${idx}`} className="p-2 h-24 bg-gray-50"></div>)}
                {eachDayInMonth.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    return (
                        <div
                            key={idx}
                            className={`p-2 h-24 text-right relative transition-colors cursor-pointer 
                            ${isSelected ? "bg-[#588baa] text-white" : "bg-white"}
                            ${!isSelected && isCurrentDay ? "bg-blue-50 text-[#467cd3] font-bold" : ""}
                            ${!isSelected ? "hover:bg-gray-100" : ""}
                            `}
                            onClick={() => onDateSelect(day)}
                        >
                            <span className={`absolute top-1 right-1 text-sm ${isSelected ? 'text-white' : isCurrentDay ? 'text-blue-600' : 'text-gray-500'}`}>
                                {format(day, "d")}
                            </span>
                              {/* Event dot */}
                            {hasEvent(day) && (
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#58aa59]"></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}