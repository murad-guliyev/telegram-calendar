import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text, Spinner } from "@chakra-ui/react";
import {
  setHours,
  setMinutes,
  startOfWeek,
  addDays,
  subDays,
  getDay,
  format,
  parse,
  Locale,
} from "date-fns";
import { az } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useSwipeable } from "react-swipeable";

import { useUser } from "../contexts/user";
import CustomToolbar from "../components/custom-toolbar";
import EventModal from "../components/event-modal";
import RegisterModal from "../components/register-modal";
import { TEvent } from "../models/event";
import { getEventsByOwnerId } from "../services/event";
import PageTitle from "../components/title";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  az,
};

const localizer = dateFnsLocalizer({
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

const MyCalendar: React.FC = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TEvent | undefined>(
    undefined
  );
  const [minTime, setMinTime] = useState<Date>(new Date());
  const [maxTime, setMaxTime] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [view, setView] = useState<string>("day");

  useEffect(() => {
    if (user?.firebaseData?.id) {
      loadUserDetails(user.firebaseData.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.firebaseData?.id]);

  const loadUserDetails = async (ownerId: string) => {
    try {
      setLoading(true);
      const eventsData = await getEventsByOwnerId(ownerId);
      setEvents(eventsData);

      const userStartTime = user?.firebaseData?.startTime;
      const userEndTime = user?.firebaseData?.endTime;

      if (userStartTime && userEndTime) {
        const startHour = parseInt(userStartTime.split(":")[0]);
        const startMinutes = parseInt(userStartTime.split(":")[1]);
        const endHour = parseInt(userEndTime.split(":")[0]);
        const endMinutes = parseInt(userEndTime.split(":")[1]);

        setMinTime(setMinutes(setHours(new Date(), startHour), startMinutes));
        setMaxTime(setMinutes(setHours(new Date(), endHour), endMinutes));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event: TEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (user?.firebaseData?.id) {
      loadUserDetails(user.firebaseData.id);
      setSelectedEvent(undefined);
    }
  };

  // Added: Handle slot selection
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setIsModalOpen(true);
  };

  const handleSwipe = (direction: "left" | "right") => {
    let dateIncrement;
    switch (view) {
      case "month":
        dateIncrement =
          direction === "left"
            ? addDays(currentDate, 30)
            : subDays(currentDate, 30);
        break;
      case "week":
        dateIncrement =
          direction === "left"
            ? addDays(currentDate, 7)
            : subDays(currentDate, 7);
        break;
      default:
        dateIncrement =
          direction === "left"
            ? addDays(currentDate, 1)
            : subDays(currentDate, 1);
    }
    setCurrentDate(dateIncrement);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Məlumatlar yüklənir...</Text>
      </Flex>
    );
  }

  return (
    <Box style={{ height: "100%" }} {...handlers}>
      <PageTitle title="Cədvəl" />
      {!user?.firebaseData?.id ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height={["calc(100% - 64px)", "100%"]}
        >
          <Text fontSize="xl" mb={4} px={4} textAlign="center">
            Öz cədvəlini yaratmaq üçün qeydiyyatdan keç
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
          />
        </Flex>
      ) : (
        <>
          <Flex pb={4} justifyContent="end">
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Cədvəl paylaşımı",
                      text: "Cədvələ baxın:",
                      url: window.location.href, // Share the current page URL
                    })
                    .then(() => console.log("Link paylaşımı uğurla edildi"))
                    .catch((error) =>
                      console.error("Link paylaşımı uğursuz oldu:", error)
                    );
                } else {
                  alert("Paylaşma funksiyası bu cihazda dəstəklənmir.");
                }
              }}
              colorScheme="green"
              mr={2}
            >
              Paylaş
            </Button>

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
            onSelectSlot={handleSelectSlot} // Slot selection for creating new events
            selectable // Enables slot selection
            date={currentDate}
            onNavigate={(date: Date) => setCurrentDate(date)}
            style={{ height: "700px" }}
            views={{
              day: true,
              week: true,
              month: true,
            }}
            view={view}
            onView={(newView: string) => setView(newView)}
            step={30}
            timeslots={2}
            min={minTime}
            max={maxTime}
            messages={calendarMessages}
            components={{
              toolbar: (props: any) => (
                <CustomToolbar
                  {...props}
                  currentDate={currentDate}
                  showViewSwitcher={true}
                  view={view}
                />
              ),
            }}
            formats={{
              timeGutterFormat: "HH:mm",
              eventTimeRangeFormat: (
                { start, end }: { start: string; end: string },
                culture: string,
                localizer: any
              ) =>
                `${localizer.format(
                  start,
                  "HH:mm",
                  culture
                )} - ${localizer.format(end, "HH:mm", culture)}`,
            }}
          />

          <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onEventChange={handleSaveEvent}
            initialEvent={selectedEvent}
          />
        </>
      )}
    </Box>
  );
};

export default MyCalendar;
