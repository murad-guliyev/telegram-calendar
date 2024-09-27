import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Divider,
} from "@chakra-ui/react";

const daysOfWeek = {
  monday: "Bazar ertəsi",
  tuesday: "Çərşənbə axşamı",
  wednesday: "Çərşənbə",
  thursday: "Cümə axşamı",
  friday: "Cümə",
  saturday: "Şənbə",
  sunday: "Bazar",
};

const Profile: React.FC = () => {
  const username = "Anonim";
  const phone = "1234567890";
  const workingDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const startHour = new Date(new Date().setHours(9, 0, 0));
  const endHour = new Date(new Date().setHours(18, 0, 0));

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
          <Text fontSize="md">{phone}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            İş Günləri:
          </Text>
          <HStack spacing={2} wrap="wrap">
            {workingDays.map((day) => (
              <Badge key={day} colorScheme="blue" px={2} py={1}>
                {daysOfWeek[day as keyof typeof daysOfWeek]}
              </Badge>
            ))}
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg">
            İş Saatları:
          </Text>
          <Text fontSize="md">
            {startHour.toLocaleTimeString("az-AZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {endHour.toLocaleTimeString("az-AZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Box>
      </VStack>
      <Divider my={4} />
      <Text fontSize="sm" color="gray.500">
        Bu məlumatlar qeydiyyat zamanı daxil etdiyiniz detallara əsasən
        göstərilir.
      </Text>
    </Box>
  );
};

export default Profile;
