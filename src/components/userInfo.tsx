import { Box, Text } from "@chakra-ui/react";
import { useUser } from "../contexts/user";

const UserInfo: React.FC = () => {
  const { user } = useUser(); // Get user data from the context

  if (!user) {
    return <Text>Loading user data from Telegram...</Text>;
  }

  return (
    <Box mb={4}>
      <Text fontSize="xl" fontWeight="bold">
        Welcome, {user.telegramData?.first_name}{" "}
        {user.telegramData?.last_name ?? ""}
      </Text>
      <Text>Telegram ID: {user.telegramData?.id}</Text>
      <Text>
        Username: {user.telegramData?.username ?? "No username available"}
      </Text>
    </Box>
  );
};

export default UserInfo;
