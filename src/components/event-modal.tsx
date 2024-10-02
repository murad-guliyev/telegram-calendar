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
  const [event, setEvent] = useState<TEvent>({
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
  });

  // Sync state with initialEvent when modal opens
  useEffect(() => {
    if (initialEvent) {
      setEvent({
        ...initialEvent,
        start: new Date(initialEvent.start),
        end: new Date(initialEvent.end),
      });
    } else {
      // Reset for new event
      setEvent({
        id: "",
        title: "",
        start: new Date(),
        end: new Date(),
        allDay: false,
      });
    }
  }, [initialEvent]);

  // Handle changes for different fields in the event object
  const handleChange = (field: keyof TEvent, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save Event (Create or Update)
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
      onEventChange(); // Notify parent to refresh the event list
      onClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldurun");
    }
  };

  // Delete Event
  const handleDelete = async () => {
    if (initialEvent) {
      await deleteEvent(initialEvent.id);
      onEventChange(); // Notify parent to refresh the event list
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialEvent ? "Hadisəni Redaktə Et" : "Yeni Hadisə Əlavə Et"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="title" mb={4}>
            <FormLabel>Hadisə Başlığı</FormLabel>
            <Input
              value={event.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Hadisə başlığını daxil edin"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mb={4}>
            <Checkbox
              isChecked={event.allDay}
              onChange={(e) => handleChange("allDay", e.target.checked)}
            >
              Bütün gün
            </Checkbox>
          </FormControl>

          <FormControl id="start" mb={4}>
            <FormLabel>Başlanğıc Vaxtı</FormLabel>
            <DatePicker
              selected={event.start}
              onChange={(date: Date | null) =>
                date && handleChange("start", date)
              }
              showTimeSelect={!event.allDay}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={event.allDay ? "P" : "Pp"}
              className="chakra-input"
              withPortal
              onFocus={(e) => e.target.blur()}
            />
          </FormControl>

          <FormControl id="end" mb={4}>
            <FormLabel>Son Vaxt</FormLabel>
            <DatePicker
              selected={event.end}
              onChange={(date: Date | null) =>
                date && handleChange("end", date)
              }
              showTimeSelect={!event.allDay}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={event.allDay ? "P" : "Pp"}
              className="chakra-input"
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
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
