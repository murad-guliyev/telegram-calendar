import React, { useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  HStack,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { daysOfWeek } from "../utils/daysOfWeek";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { TUserData } from "../models/user";
import PageTitle from "./title";

interface ProfileEditProps {
  userData: TUserData;
  onSave: (updatedProfile: TUserData) => void;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  userData,
  onSave,
  onCancel,
}) => {
  const [username, setUsername] = useState(userData.username);
  const [phone, setPhone] = useState(userData.phone);
  const [workingDays, setWorkingDays] = useState(userData.workingDays);
  const [startTime, setStartTime] = useState(
    userData.startTime
      ? new Date(`1970-01-01T${userData.startTime}:00`)
      : new Date(new Date().setHours(9, 0, 0))
  );
  const [endTime, setEndTime] = useState(
    userData.endTime
      ? new Date(`1970-01-01T${userData.endTime}:00`)
      : new Date(new Date().setHours(18, 0, 0))
  );

  const handleSave = () => {
    const updatedProfile: TUserData = {
      username,
      phone,
      workingDays,
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
    };
    onSave(updatedProfile);
  };

  const handleToggleDay = (dayId: string) => {
    setWorkingDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((day) => day !== dayId)
        : [...prev, dayId]
    );
  };

  return (
    <Box>
      <PageTitle title="Profili Redaktə et" />

      <VStack spacing={4} align="start">
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
            onChange={setPhone}
            inputStyle={{ width: "100%", fontSize: "16px" }}
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

        <FormControl id="workingHours" mb={4}>
          <FormLabel>İş saatları</FormLabel>
          <VStack spacing={4} align="start">
            <Box>
              <FormLabel fontSize="sm">Başlanğıc saatı</FormLabel>
              <DatePicker
                selected={startTime}
                onChange={(date: Date | null) => date && setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Saat"
                timeFormat="HH:mm" // Use 24-hour time format
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
                timeFormat="HH:mm" // Use 24-hour time format
                dateFormat="HH:mm"
                className="chakra-input"
                onFocus={(e) => e.target.blur()}
                withPortal
              />
            </Box>
          </VStack>
        </FormControl>
      </VStack>
      <Divider my={4} />
      <HStack spacing={4} mt={4} justify="end">
        <Button colorScheme="green" onClick={handleSave}>
          Yadda Saxla
        </Button>
        <Button colorScheme="red" variant="outline" onClick={onCancel}>
          Ləğv et
        </Button>
      </HStack>
    </Box>
  );
};

export default ProfileEdit;
