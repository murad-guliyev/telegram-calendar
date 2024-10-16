import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { createEvent, updateEvent, deleteEvent } from "../services/event";
import { TEvent } from "../models/event";

import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../contexts/user";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventChange: () => void;
  initialEvent?: TEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onEventChange,
  initialEvent,
}) => {
  const { user } = useUser();

  const initialEventState: TEvent = {
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
  };

  const [event, setEvent] = useState<TEvent>(initialEventState);
  const [minTime, setMinTime] = useState(new Date());
  const [maxTime, setMaxTime] = useState(new Date());

  useEffect(() => {
    if (initialEvent) {
      setEvent({
        ...initialEvent,
        start: new Date(initialEvent.start),
        end: new Date(initialEvent.end),
      });
    } else {
      const currentTime = new Date();
      const startTime =
        currentTime >= minTime && currentTime <= maxTime
          ? currentTime
          : minTime;

      setEvent({
        ...initialEventState,
        start: startTime,
        end: new Date(startTime.getTime() + 60 * 60 * 1000), // Default end time to 1 hour after start
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEvent, minTime, maxTime]);

  // Sync working hours from user data
  useEffect(() => {
    if (user?.firebaseData?.startTime && user?.firebaseData?.endTime) {
      const startHour = parseInt(user.firebaseData.startTime.split(":")[0]);
      const startMinutes = parseInt(user.firebaseData.startTime.split(":")[1]);
      const endHour = parseInt(user.firebaseData.endTime.split(":")[0]);
      const endMinutes = parseInt(user.firebaseData.endTime.split(":")[1]);

      const startDate = new Date(
        new Date().setHours(startHour, startMinutes, 0, 0)
      );
      const endDate = new Date(new Date().setHours(endHour, endMinutes, 0, 0));

      setMinTime(startDate);
      setMaxTime(endDate);
    }
  }, [user]);

  const handleChange = (field: keyof TEvent, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle All-Day Checkbox Toggle
  const handleAllDayToggle = (checked: boolean) => {
    const updatedStart = new Date(event.start.setHours(0, 0, 0, 0)); // Set to midnight
    const updatedEnd = new Date(event.end.setHours(23, 59, 59, 999)); // Set to end of day

    setEvent((prev) => ({
      ...prev,
      allDay: checked,
      start: checked ? updatedStart : prev.start,
      end: checked ? updatedEnd : prev.end,
    }));
  };

  const validateEndTime = (newStartTime: Date) => {
    if (event.end <= newStartTime) {
      const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
      setEvent((prev) => ({
        ...prev,
        end: newEndTime,
      }));
    }
  };

  const handleSave = async () => {
    const ownerId = user?.telegramData?.id;
    if (!ownerId) {
      return;
    }

    if (event.title && event.start && event.end) {
      if (initialEvent) {
        await updateEvent(event.id, event, ownerId);
      } else {
        await createEvent(event, ownerId);
      }
      onEventChange();
      handleClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldurun");
    }
  };

  const handleDelete = async () => {
    if (initialEvent) {
      await deleteEvent(initialEvent.id);
      onEventChange();
      handleClose();
    }
  };

  const handleClose = () => {
    setEvent(initialEventState);
    onClose();
  };

  const generateTimeIntervals = () => {
    const intervals = [];
    const currentDate = new Date();
    let current = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      minTime.getHours(),
      minTime.getMinutes()
    );

    while (current <= maxTime) {
      intervals.push(new Date(current));
      current.setMinutes(current.getMinutes() + 15); // Increment by 15 minutes
    }

    return intervals;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialEvent ? "Hadisəni Redaktə Et" : "Yeni Hadisə Əlavə Et"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="title" mb={4}>
            <FormLabel>Başlığ</FormLabel>
            <Input
              value={event.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Hadisə başlığını daxil et"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mb={4}>
            <Checkbox
              isChecked={event.allDay}
              onChange={(e) => handleAllDayToggle(e.target.checked)}
            >
              Bütün gün
            </Checkbox>
          </FormControl>

          <FormControl id="start" mb={4}>
            <FormLabel>Başlanğıc Vaxtı</FormLabel>
            <DatePicker
              selected={event.start}
              onChange={(date: Date | null) => {
                if (date) {
                  handleChange("start", date);
                  validateEndTime(date);
                }
              }}
              showTimeSelect={!event.allDay}
              includeTimes={event.allDay ? undefined : generateTimeIntervals()}
              timeFormat="HH:mm"
              dateFormat={event.allDay ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
              className="chakra-input"
              timeCaption="Saat"
              withPortal
              onFocus={(e) => e.target.blur()}
            />
          </FormControl>

          <FormControl id="end" mb={4}>
            <FormLabel>Bitmə Vaxtı</FormLabel>
            <DatePicker
              selected={event.end}
              onChange={(date: Date | null) =>
                date && handleChange("end", date)
              }
              showTimeSelect={!event.allDay}
              includeTimes={event.allDay ? undefined : generateTimeIntervals()}
              timeFormat="HH:mm"
              dateFormat={event.allDay ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
              className="chakra-input"
              timeCaption="Saat"
              withPortal
              onFocus={(e) => e.target.blur()}
            />
          </FormControl>
        </ModalBody>

        <Divider my={4} />

        <ModalFooter pb={8}>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            {initialEvent ? "Yadda Saxla" : "Yarat"}
          </Button>
          {initialEvent && (
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              onClick={handleDelete}
            >
              Sil
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            Ləğv et
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
