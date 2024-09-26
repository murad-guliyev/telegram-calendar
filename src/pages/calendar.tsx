// src/Calendar.tsx
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { az } from "date-fns/locale"; // Azerbaijani locale
import { v4 as uuidv4 } from "uuid"; // Import uuid
import EventModal from "../components/event-modal";
import CustomToolbar from "../components/custom-toolbar"; // Import custom toolbar
import { Box, Flex, Button } from "@chakra-ui/react";

const locales = {
  az, // Use Azerbaijani locale
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: az }), // Start of the week for Azerbaijani
  getDay,
  locales,
});

// Azerbaijani translations for calendar messages
const calendarMessages = {
  today: "Bugün",
  previous: "Əvvəlki",
  next: "Sonrakı",
  month: "Ay",
  week: "Həftə",
  day: "Gün",
  agenda: "Gündəm",
  date: "Tarix",
  time: "Vaxt",
  event: "Hadisə",
  noEventsInRange: "Bu aralıqda hadisə yoxdur",
  showMore: (total: number) => `Daha çox (${total})`,
};

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

  // Handle selecting a time slot (mobile-friendly)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null); // No existing event selected
    setIsModalOpen(true); // Open modal to add a new event
  };

  // Handle selecting an event for editing
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event); // Set the event to be edited
    setSelectedSlot(null); // No need to use a time slot for editing
    setIsModalOpen(true); // Open the modal for editing
  };

  // Handle saving a new or edited event
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
      setEvents([...events, newEvent]); // Add the new event
    }
  };

  return (
    <Box style={{ height: "100%" }}>
      <Flex py={4} justifyContent="end">
        <Button onClick={() => setIsModalOpen(true)} colorScheme="blue">
          Yeni hadisə
        </Button>
      </Flex>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot} // Add event on slot press
        onSelectEvent={handleSelectEvent} // Open modal for event editing
        style={{ height: "100%" }}
        defaultView="day"
        views={["day", "week"]}
        step={30} // Set time step to 30 minutes (optional)
        timeslots={2} // Set to 2 timeslots per hour (optional)
        messages={calendarMessages} // Use custom Azerbaijani messages
        components={{
          toolbar: CustomToolbar, // Use the custom toolbar
        }}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent} // Pass selected event to modal for editing (null for new)
      />
    </Box>
  );
};

export default MyCalendar;
