import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { az } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";
import EventModal from "../components/event-modal";
import CustomToolbar from "../components/custom-toolbar";
import { Box, Flex, Button } from "@chakra-ui/react";

const locales = {
  az,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: az }),
  getDay,
  locales,
});

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

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (title: string, start: Date, end: Date) => {
    if (selectedEvent) {
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, title, start, end }
            : event
        )
      );
    } else {
      const newEvent: Event = {
        id: uuidv4(),
        title,
        start,
        end,
      };
      setEvents([...events, newEvent]);
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
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
        defaultView="day"
        views={["day", "week"]}
        step={30}
        timeslots={2}
        messages={calendarMessages}
        components={{
          toolbar: CustomToolbar,
        }}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent}
      />
    </Box>
  );
};

export default MyCalendar;
