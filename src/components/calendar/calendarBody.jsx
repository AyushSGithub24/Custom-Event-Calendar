import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

const weekDays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EventCalender(){
    const today = new Date('2025-6-01'); // You can change this date to test with different months
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);

    const eachDayInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    })

    const startingDay = (firstDayOfMonth.getDay()-1)<0?6:firstDayOfMonth.getDay()-1;

    const emptyDays = Array.from({ length: startingDay }, (_, i) => i + 1);

    return <>
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {format(today, "MMMM yyyy")}
            </h1>
            <div className="calendar grid grid-cols-7 gap-4">
                {weekDays.map((day) => (
                    <div key={day} className="font-bold text-center">
                        {day}
                    </div>
                ))}
                {emptyDays.map((_, idx) => (
                    <div key={idx} className="p-2 border rounded"></div>
                ))}
                {eachDayInMonth.map((day,idx) => (
                    <div key={idx} className="p-2 border rounded text-center">
                        {format(day, "d")}
                    </div>
                ))}
            </div>
        </div>
    </>
}