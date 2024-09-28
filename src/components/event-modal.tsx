import React, { useState, useEffect } from "react";
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Import necessary functions
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp

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

    // Add User

    const addUser = async (
      phone_number: string,
      username: string,
      work_schedule: Array<string>,
      service_duration: number,
      start_time: string, 
      end_time: string, 
      created_at: string, 
    ): Promise<void> => {
      try {
        const docRef = await addDoc(collection(db, "event"), {
          phone_number: phone_number,
          username: username,
          work_schedule: work_schedule,
          service_duration: service_duration,
          start_time: start_time, 
          end_time: end_time, 
          created_at: Timestamp.fromDate(new Date(created_at))
        });
        console.log("New event added with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding new event: ", e);
      }
    };

    addUser(
      '994',
      'Kamran',
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      30,
      "18:00",
      "20:00",
      "2024-09-28T13:00:00Z"
    );
    
    // Add Event

    // const addEvent = async (
    //   title: string, 
    //   owner_id: string, 
    //   start_datetime: string, 
    //   end_datetime: string, 
    //   status: 'pending' | 'completed' | 'cancelled', 
    //   whole_day: boolean = false
    // ): Promise<void> => {
    //   try {
    //     const docRef = await addDoc(collection(db, "event"), {
    //       title: title,
    //       owner_id: owner_id,
    //       start_datetime: Timestamp.fromDate(new Date(start_datetime)),
    //       end_datetime: Timestamp.fromDate(new Date(end_datetime)),
    //       status: status,
    //       whole_day: whole_day
    //     });
    //     console.log("New event added with ID: ", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding new event: ", e);
    //   }
    // };

    // addEvent(
    //   "Rashid's event",
    //   "user_id_54321",
    //   "2024-09-28T10:00:00Z",
    //   "2024-09-28T11:00:00Z",
    //   "pending",
    //   false
    // );

    // Update Event
    
    // const updateEvent = async (
    //   eventId: string, 
    //   title?: string, 
    //   owner_id?: string, 
    //   start_datetime?: string, 
    //   end_datetime?: string, 
    //   status?: 'pending' | 'completed' | 'cancelled', 
    //   whole_day?: boolean
    // ): Promise<void> => {
    //   try {
    //     const eventRef = doc(db, "event", eventId);
    //     const updatedFields: any = {};

    //     if (title !== undefined) updatedFields.title = title;
    //     if (owner_id !== undefined) updatedFields.owner_id = owner_id;
    //     if (start_datetime !== undefined) updatedFields.start_datetime = Timestamp.fromDate(new Date(start_datetime));
    //     if (end_datetime !== undefined) updatedFields.end_datetime = Timestamp.fromDate(new Date(end_datetime));
    //     if (status !== undefined) updatedFields.status = status;
    //     if (whole_day !== undefined) updatedFields.whole_day = whole_day;

    //     await updateDoc(eventRef, updatedFields);
    //     console.log("Event updated successfully!");
    //   } catch (e) {
    //     console.error("Error updating event: ", e);
    //   }
    // };

    // updateEvent(
    //   "CzMnVO5XRptRdJd26QKb",
    //   "Updated Event Title",
    //   "user_id_54321",
    //   "2024-09-28T12:00:00Z",
    //   "2024-09-28T13:00:00Z",
    //   "completed",
    //   false
    // );

    // Delete Event
    // const deleteEvent = async (eventId: string): Promise<void> => {
    //   try {
    //     const eventRef = doc(db, "event", eventId);
    //     await deleteDoc(eventRef);
    //     console.log("Event deleted successfully!");
    //   } catch (e) {
    //     console.error("Error deleting event: ", e);
    //   }
    // };
    
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
        <ModalFooter>
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
