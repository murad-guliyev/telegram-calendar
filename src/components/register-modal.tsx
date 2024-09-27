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
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";

import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    username: string,
    phone: string,
    workingDays: string[],
    startHour: Date,
    endHour: Date
  ) => void;
  initialUsername?: string;
  initialPhone?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUsername = "",
  initialPhone = "",
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [phone, setPhone] = useState(initialPhone);
  const [workingDays, setWorkingDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);
  const [startHour, setStartHour] = useState(
    new Date(new Date().setHours(9, 0, 0))
  );
  const [endHour, setEndHour] = useState(
    new Date(new Date().setHours(18, 0, 0))
  );

  const daysOfWeek = [
    { id: "monday", label: "Bazar ertəsi" },
    { id: "tuesday", label: "Çərşənbə axşamı" },
    { id: "wednesday", label: "Çərşənbə" },
    { id: "thursday", label: "Cümə axşamı" },
    { id: "friday", label: "Cümə" },
    { id: "saturday", label: "Şənbə" },
    { id: "sunday", label: "Bazar" },
  ];

  useEffect(() => {
    setUsername(initialUsername);
    setPhone(initialPhone);
  }, [initialUsername, initialPhone]);

  const handleSave = () => {
    if (username && phone) {
      onSave(
        username,
        phone,
        workingDays,
        new Date(startHour),
        new Date(endHour)
      );
      onClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldurun");
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
                (İşlədiyiniz günləri seçin)
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

          {/* Working Hours Section */}
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
                selected={startHour}
                onChange={(date: Date | null) => date && setStartHour(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Saat"
                dateFormat="HH:mm"
                className="chakra-input"
              />
            </Box>
            <Box>
              <FormLabel fontSize="sm">Bitmə saatı</FormLabel>
              <DatePicker
                selected={endHour}
                onChange={(date: Date | null) => date && setEndHour(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Saat"
                dateFormat="HH:mm"
                className="chakra-input"
              />
            </Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
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
