import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to capture URL params
import { Box, Text } from "@chakra-ui/react";
import {
  format,
  getDay,
  parse,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns";
import { az } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import CustomToolbar from "../components/custom-toolbar";
import { TEvent } from "../models/event";
import { getEventsByOwnerId } from "../services/event";
import { getUser } from "../services/user";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/custom-calendar.css"; // Add this import to include custom styles

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
  const [minTime, setMinTime] = useState<Date>(new Date());
  const [maxTime, setMaxTime] = useState<Date>(new Date());

  useEffect(() => {
    if (ownerId) {
      const fetchEventsAndMasterDetails = async () => {
        const [userDetails, eventsData] = await Promise.all([
          getUser(ownerId),
          getEventsByOwnerId(ownerId),
        ]);

        // Set events
        setEvents(eventsData);

        // If user details are found, set working hours
        if (userDetails?.startTime && userDetails?.endTime) {
          const startHour = parseInt(userDetails.startTime.split(":")[0]);
          const startMinutes = parseInt(userDetails.startTime.split(":")[1]);

          const endHour = parseInt(userDetails.endTime.split(":")[0]);
          const endMinutes = parseInt(userDetails.endTime.split(":")[1]);

          // Set min and max time using the master’s working hours
          setMinTime(setMinutes(setHours(new Date(), startHour), startMinutes));
          setMaxTime(setMinutes(setHours(new Date(), endHour), endMinutes));
        }
      };
      fetchEventsAndMasterDetails();
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
        min={minTime} // Set min time based on master’s start time
        max={maxTime} // Set max time based on master’s end time
        messages={calendarMessages}
        components={{
          toolbar: CustomToolbar,
        }}
        formats={{
          timeGutterFormat: "HH:mm", // 24-hour format for time slots
          eventTimeRangeFormat: (
            { start, end }: { start: Date; end: Date },
            culture: string,
            localizer: any
          ) =>
            `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
              end,
              "HH:mm",
              culture
            )}`, // 24-hour format for event times
        }}
      />
    </Box>
  );
};

export default MasterDetails;
