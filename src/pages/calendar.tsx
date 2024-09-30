import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { az } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import CustomToolbar from "../components/custom-toolbar";
import EventModal from "../components/event-modal";
import RegisterModal from "../components/register-modal";
import { TEvent } from "../models/event";
import { getEventsByOwnerId } from "../services/event"; // Import the event service

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

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<TEvent | undefined>(
    undefined
  );
  const [userId, setUserId] = useState<string | null>("773338374");

  useEffect(() => {
    if (userId) {
      // Fetch events from Firestore when userId is set
      loadUserEvents(userId);
    }
  }, [userId]);

  // Function to load events based on owner_id
  const loadUserEvents = async (ownerId: string) => {
    const eventsData = await getEventsByOwnerId(ownerId);
    console.log("Events loaded: ", eventsData);
    setEvents(eventsData);
  };

  const handleSelectEvent = (event: TEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    // Refresh events after an event is saved
    if (userId) {
      loadUserEvents(userId);
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
          Cədvəl yaratmaq üçün qeydiyyatdan keçin
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
        onEventChange={handleSaveEvent}
        initialEvent={selectedEvent}
      />
    </Box>
  );
};

export default MyCalendar;
