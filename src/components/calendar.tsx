// src/Calendar.tsx
import React, { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales,
});

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: "Sample Event",
      start: new Date(),
      end: new Date(),
      allDay: true,
    },
  ]);

  return (
    <div style={{ height: "500px" }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default Calendar;
