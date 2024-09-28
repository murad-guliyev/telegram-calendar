import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  Badge,
  Button,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { daysOfWeek } from "../utils/daysOfWeek";
import { TUserData } from "../models/user";

interface ProfileViewProps {
  userData: TUserData;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData, onEdit }) => {
  const { username, phone, workingDays, startTime, endTime } = userData;
  return (
    <Box p={4} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>
        Profil Məlumatları
      </Heading>
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
            {workingDays.map((day) => (
              <Badge key={day} colorScheme="blue" px={2} py={1}>
                {daysOfWeek.find((d) => d.id === day)?.label}
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
