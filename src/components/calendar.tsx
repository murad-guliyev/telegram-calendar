// src/Calendar.tsx
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import EventModal from "./event-modal";

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
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null); // New event, no existing event selected
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event); // Set the event to be edited
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleSaveEvent = (title: string, start: Date, end: Date) => {
    if (selectedEvent) {
      // Editing an existing event
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, title, start, end } // Update the event
            : event
        )
      );
    } else {
      // Creating a new event
      const newEvent: Event = {
        id: uuidv4(), // Assign a unique ID
        title,
        start,
        end,
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent} // Handle event selection for editing
        style={{ height: "100%" }}
        defaultView="month"
        views={["month", "week", "day"]}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent} // Pass the selected event to the modal for editing
      />
    </div>
  );
};

export default MyCalendar;
