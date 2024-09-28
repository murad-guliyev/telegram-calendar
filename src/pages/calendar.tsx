import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { az } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";
import EventModal from "../components/event-modal";
import CustomToolbar from "../components/custom-toolbar";
import RegisterModal from "../components/register-modal"; // Assuming RegisterModal is created
import { Box, Flex, Button, Text } from "@chakra-ui/react";

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
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

  const handleUserCreate = (createdUserId: string) => {
    setUserId(createdUserId);
  };

  if (!userId) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="100%"
      >
        <Text fontSize="xl" mb={4} px={4} textAlign="center">
          Cədvəl yaradmaq üçün qeydiyyatdan keçin
        </Text>
        <Button
          onClick={() => setIsRegisterModalOpen(true)}
          colorScheme="blue"
          width="256px"
        >
          Qeydiyyat
        </Button>
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onUserCreate={handleUserCreate}
        />
      </Flex>
    );
  }

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
        longPressThreshold={100}
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
