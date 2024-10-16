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
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import { createUser } from "../services/user";
import { TUserData } from "../models/user";
import { useUser } from "../contexts/user";

import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { daysOfWeek } from "../utils/daysOfWeek";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useUser(); // Access setUser from UserContext

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);
  const [startTime, setStartTime] = useState(
    new Date(new Date().setHours(9, 0, 0))
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(18, 0, 0))
  );

  useEffect(() => {
    // If the user data exists, prefill the username and phone fields
    if (user?.telegramData) {
      setUsername(
        `${user.telegramData.first_name} ${user.telegramData.last_name}` || ""
      );
    }
  }, [user]);

  const formatTime = (date: Date) => format(date, "HH:mm");

  const handleSave = () => {
    const userId = user?.telegramData?.id;

    if (!userId) {
      return;
    }

    if (username && phone) {
      const data: TUserData = {
        username,
        phone,
        workingDays,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      };

      createUser(data, userId).then((createdUserId: string | undefined) => {
        if (createdUserId) {
          // Update the context with the new user data
          setUser((prevUser) => ({
            telegramData: prevUser?.telegramData || null,
            firebaseData: { id: createdUserId, ...data },
          }));
        }
      });

      onClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldur");
    }
  };

  const handleToggleDay = (dayId: string) => {
    setWorkingDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((day) => day !== dayId)
        : [...prev, dayId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Qeydiyyat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="username" mb={4}>
            <FormLabel>İstifadəçi adı</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="İstifadəçi adını daxil edin"
            />
          </FormControl>
          <FormControl id="phone" mb={4}>
            <FormLabel>Telefon nömrəsi</FormLabel>
            <PhoneInput
              country={"az"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputStyle={{
                width: "100%",
                fontSize: "16px",
              }}
              placeholder="Telefon nömrəsini daxil edin"
            />
          </FormControl>

          <FormControl id="workingDays" mb={4}>
            <FormLabel>
              İş günləri
              <Text display="inline-block" ml={1} color="gray.500">
                (İşlədiyin günləri seç)
              </Text>
            </FormLabel>
            <VStack align="start" spacing={2}>
              {daysOfWeek.map((day) => (
                <Checkbox
                  key={day.id}
                  isChecked={workingDays.includes(day.id)}
                  onChange={() => handleToggleDay(day.id)}
                >
                  {day.label}
                </Checkbox>
              ))}
            </VStack>
          </FormControl>

          <FormControl id="workingHours" mb={4}>
            <FormLabel>
              İş saatları
              <Text display="inline-block" ml={1} color="gray.500">
                (Standart 09:00 - 18:00)
              </Text>
            </FormLabel>
            <Box mb={2}>
              <FormLabel fontSize="sm">Başlanğıc saatı</FormLabel>
              <DatePicker
                selected={startTime}
                onChange={(date: Date | null) => date && setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Saat"
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                className="chakra-input"
                onFocus={(e) => e.target.blur()}
                withPortal
              />
            </Box>
            <Box>
              <FormLabel fontSize="sm">Bitmə saatı</FormLabel>
              <DatePicker
                selected={endTime}
                onChange={(date: Date | null) => date && setEndTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Saat"
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                className="chakra-input"
                onFocus={(e) => e.target.blur()}
                withPortal
              />
            </Box>
          </FormControl>
        </ModalBody>
        <Divider my={4} />
        <ModalFooter pb={8}>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Qeydiyyatdan keç
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
