import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Spinner, Flex } from "@chakra-ui/react";
import {
  setHours,
  setMinutes,
  startOfWeek,
  addDays,
  subDays,
  Locale,
  getDay,
  format,
  parse,
} from "date-fns";
import { az } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useSwipeable } from "react-swipeable";
import CustomToolbar from "../components/custom-toolbar";
import { TEvent } from "../models/event";
import { getEventsByOwnerId } from "../services/event";
import { getUser } from "../services/user";

import "../styles/custom-calendar.css"; // Include custom styles if needed

const locales = {
  az,
};

const localizer: any = dateFnsLocalizer({
  format: (date: Date, formatStr: string, options?: { locale: Locale }) =>
    format(date, formatStr, options),
  parse: (value: string, formatString: string, options?: { locale: Locale }) =>
    parse(value, formatString, new Date(), options),
  startOfWeek: (date: Date, options?: { locale: Locale }) =>
    startOfWeek(date, options),
  getDay: (date: Date) => getDay(date),
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    if (ownerId) {
      const fetchEventsAndMasterDetails = async () => {
        try {
          setLoading(true); // Start loading

          const [userDetails, eventsData] = await Promise.all([
            getUser(ownerId),
            getEventsByOwnerId(ownerId),
          ]);

          // Set events
          setEvents(eventsData);

          // Set owner name if available
          if (userDetails?.username) {
            setOwnerName(userDetails.username);
          }

          // If user details are found, set working hours
          if (userDetails?.startTime && userDetails?.endTime) {
            const startHour = parseInt(userDetails.startTime.split(":")[0]);
            const startMinutes = parseInt(userDetails.startTime.split(":")[1]);

            const endHour = parseInt(userDetails.endTime.split(":")[0]);
            const endMinutes = parseInt(userDetails.endTime.split(":")[1]);

            // Set min and max time using the master’s working hours
            setMinTime(
              setMinutes(setHours(new Date(), startHour), startMinutes)
            );
            setMaxTime(setMinutes(setHours(new Date(), endHour), endMinutes));
          }
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchEventsAndMasterDetails();
    }
  }, [ownerId]);

  // Handler for left swipe (Move to previous day)
  const handleSwipeLeft = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1)); // Move to the next day
  };

  // Handler for right swipe (Move to next day)
  const handleSwipeRight = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1)); // Move to the previous day
  };

  // Set up swipeable handlers
  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true, // Enable mouse events as well
  });

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Məlumatlar yüklənir...</Text>
      </Flex>
    );
  }

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
    <Box style={{ height: "100%" }} p={4} {...handlers}>
      <Text fontSize="2xl" mb={4}>
        {ownerName ? `${ownerName}` : "Cədvəl"}
      </Text>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={(date: any) => setCurrentDate(date)}
        style={{ height: "700px" }}
        defaultView="day"
        views={["day"]}
        step={30}
        timeslots={2}
        min={minTime}
        max={maxTime}
        messages={calendarMessages}
        components={{
          toolbar: (props: any) => (
            <CustomToolbar {...props} showViewSwitcher={false} />
          ),
        }}
        formats={{
          timeGutterFormat: "HH:mm",
          eventTimeRangeFormat: (
            { start, end }: { start: string; end: string },
            culture: string,
            localizer: any
          ) =>
            `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
              end,
              "HH:mm",
              culture
            )}`,
        }}
      />
    </Box>
  );
};

export default MasterDetails;
