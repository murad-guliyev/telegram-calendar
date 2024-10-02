import React from "react";
import {
  Box,
  Text,
  VStack,
  Badge,
  Button,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { daysOfWeek } from "../utils/daysOfWeek";
import { TUserData } from "../models/user";
import PageTitle from "./title";

interface ProfileViewProps {
  userData: TUserData;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData, onEdit }) => {
  const { username, phone, workingDays, startTime, endTime } = userData;

  // Sort the workingDays based on the "order" in daysOfWeek
  const orderedWorkingDays = workingDays
    .map((day) => daysOfWeek.find((d) => d.id === day)) // Match each day in workingDays to daysOfWeek
    .filter((day): day is (typeof daysOfWeek)[number] => day !== undefined) // Filter out undefined values
    .sort((a, b) => a.order - b.order); // Sort by the "order" field

  return (
    <Box>
      <PageTitle title="Profil" />

      <VStack spacing={4} align="start">
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            İstifadəçi Adı:
          </Text>
          <Text fontSize="md">{username || "Anonim"}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg">
            Telefon Nömrəsi:
          </Text>
          <Text fontSize="md">{phone || ""}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            İş Günləri:
          </Text>
          <VStack spacing={2} align="start">
            {orderedWorkingDays.map((day) => (
              <Badge key={day.id} colorScheme="blue" px={2} py={1}>
                {day.label}
              </Badge>
            ))}
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg">
            İş Saatları:
          </Text>
          <Text fontSize="md">
            {startTime || "Təyin edilməyib"} - {endTime || "Təyin edilməyib"}
          </Text>
        </Box>
      </VStack>
      <Divider my={4} />
      <Flex justifyContent="end">
        <Button colorScheme="blue" onClick={onEdit}>
          Redaktə Et
        </Button>
      </Flex>
    </Box>
  );
};

export default ProfileView;
