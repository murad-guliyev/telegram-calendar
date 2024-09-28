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
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    start: Date,
    end: Date,
    allDay: boolean,
    description: string
  ) => void;
  initialEvent?: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setStart(initialEvent.start);
      setEnd(initialEvent.end);
      setAllDay(initialEvent.allDay || false);
      setDescription(initialEvent.description || "");
    } else {
      setTitle("");
      setStart(new Date());
      setEnd(new Date());
      setAllDay(false);
      setDescription("");
    }
  }, [initialEvent]);

  const handleSave = () => {
    // addUser(
    //   "994",
    //   "Kamran",
    //   ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    //   30,
    //   "18:00",
    //   "20:00",
    //   "2024-09-28T13:00:00Z"
    // );

    // addEvent(
    //   "Rashid's event",
    //   "user_id_54321",
    //   "2024-09-28T10:00:00Z",
    //   "2024-09-28T11:00:00Z",
    //   "pending",
    //   false
    // );

    // updateEvent(
    //   "CzMnVO5XRptRdJd26QKb",
    //   "Updated Event Title",
    //   "user_id_54321",
    //   "2024-09-28T12:00:00Z",
    //   "2024-09-28T13:00:00Z",
    //   "completed",
    //   false
    // );

    // // Example usage
    // deleteEvent("event_id_12345");

    if (title && start && end) {
      onSave(title, start, end, allDay, description);
      onClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldurun");
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hadisə başlığını daxil edin"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mb={4}>
            <Checkbox
              isChecked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            >
              Bütün gün
            </Checkbox>
          </FormControl>

          <FormControl id="start" mb={4}>
            <FormLabel>Başlanğıc Vaxtı</FormLabel>
            <DatePicker
              selected={start}
              onChange={(date: Date | null) => setStart(date)}
              showTimeSelect={!allDay}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={allDay ? "P" : "Pp"}
              className="chakra-input"
              withPortal
              onFocus={(e) => e.target.blur()}
            />
          </FormControl>

          <FormControl id="end" mb={4}>
            <FormLabel>Son Vaxt</FormLabel>
            <DatePicker
              selected={end}
              onChange={(date: Date | null) => setEnd(date)}
              showTimeSelect={!allDay}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={allDay ? "P" : "Pp"}
              className="chakra-input"
              withPortal
              onFocus={(e) => e.target.blur()}
            />
          </FormControl>

          <FormControl id="description" mb={4}>
            <FormLabel>Təsvir</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hadisə təsviri daxil edin"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter pb={8}>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Yadda Saxla
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
