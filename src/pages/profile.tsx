// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { Box, Text, Avatar, VStack, Spinner } from "@chakra-ui/react";

declare global {
  interface Window {
    Telegram: any | undefined;
  }
}

interface UserProfile {
  username: string;
  phone_number?: string;
  first_name: string;
  last_name?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const telegramUser = window.Telegram?.WebApp.initDataUnsafe?.user;

    if (telegramUser) {
      setUser({
        username: telegramUser.username || "Anonim",
        phone_number:
          window.Telegram?.WebApp.initDataUnsafe?.phone_number || "",
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
      });
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>İstifadəçi məlumatları tapılmadı</Text>
      </Box>
    );
  }

  return (
    <Box p={4} textAlign="center">
      <Avatar size="xl" name={user.first_name} mb={4} />
      <VStack spacing={2}>
        <Text fontSize="2xl" fontWeight="bold">
          {user.first_name} {user.last_name}
        </Text>
        <Text fontSize="lg" color="gray.500">
          @{user.username}
        </Text>
        {user.phone_number && (
          <Text fontSize="lg">Telefon: {user.phone_number}</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Profile;
