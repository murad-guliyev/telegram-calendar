import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to capture URL params
import { Box, Text } from "@chakra-ui/react";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { az } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "../components/custom-toolbar";
import { TEvent } from "../models/event";
import { getEventsByOwnerId } from "../services/event";

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

const MasterDetails: React.FC = () => {
  const { id: ownerId } = useParams<{ id: string }>();
  const [events, setEvents] = useState<TEvent[]>([]);

  useEffect(() => {
    if (ownerId) {
      const fetchEvents = async () => {
        const eventsData = await getEventsByOwnerId(ownerId);
        setEvents(eventsData);
      };
      fetchEvents();
    }
  }, [ownerId]);

  if (!ownerId) {
    return (
      <Box p={4} textAlign="center">
        <Text fontSize="xl" color="red.500">
          Məlumat tapılmadı
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ height: "100%" }} p={4}>
      <Text fontSize="2xl" mb={4} textAlign="center">
        Cədvəl
      </Text>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "700px" }}
        defaultView="day"
        views={["day", "week"]}
        step={30}
        timeslots={2}
        messages={calendarMessages}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default MasterDetails;
