// src/EventModal.tsx
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
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, start: Date, end: Date) => void;
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

  useEffect(() => {
    if (initialEvent) {
      // Pre-fill the form with the selected event details
      setTitle(initialEvent.title);
      setStart(initialEvent.start);
      setEnd(initialEvent.end);
    } else {
      setTitle("");
      setStart(new Date());
      setEnd(new Date());
    }
  }, [initialEvent]);

  const handleSave = () => {
    if (title && start && end) {
      onSave(title, start, end);
      onClose();
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialEvent ? "Edit Event" : "Add New Event"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="title" mb={4}>
            <FormLabel>Event Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </FormControl>
          <FormControl id="start" mb={4}>
            <FormLabel>Start Time</FormLabel>
            <DatePicker
              selected={start}
              onChange={(date: Date | null) => setStart(date)}
              showTimeSelect
              dateFormat="Pp"
              className="chakra-input" // Applies Chakra's input style
            />
          </FormControl>
          <FormControl id="end" mb={4}>
            <FormLabel>End Time</FormLabel>
            <DatePicker
              selected={end}
              onChange={(date: Date | null) => setEnd(date)}
              showTimeSelect
              dateFormat="Pp"
              className="chakra-input"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
