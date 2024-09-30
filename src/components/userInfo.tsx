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
        Welcome, {user.first_name} {user.last_name ?? ""}
      </Text>
      <Text>Telegram ID: {user.id}</Text>
      <Text>Username: {user.username ?? "No username available"}</Text>

      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="Profile"
          style={{ borderRadius: "50%", width: "100px" }}
        />
      )}
    </Box>
  );
};

export default UserInfo;
