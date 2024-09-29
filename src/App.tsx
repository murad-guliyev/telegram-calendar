import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

import Calendar from "./pages/calendar";
import Search from "./pages/search";
import Profile from "./pages/profile";
import MasterDetails from "./pages/master-details";
import Menu from "./components/menu";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Initialize Telegram WebApp and fetch user data
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand(); // Expand the mini app

      // Access the user data from Telegram
      const userData: TelegramUser = webApp.initDataUnsafe?.user;

      // Set the user data in state
      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  return (
    <ChakraProvider>
      <div className="App">
        <Router>
          <Flex direction="column" height="100vh" gap={8}>
            <Box flex="1" p={4} overflowY="auto">
              {/* Display user information if available */}
              {user ? (
                <Box mb={4}>
                  <Text fontSize="xl" fontWeight="bold">
                    Welcome, {user.first_name} {user.last_name ?? ""}
                  </Text>
                  <Text>Telegram ID: {user.id}</Text>
                  <Text>Username: {user.username ?? "No username available"}</Text>
                  {user.photo_url && (
                    <img src={user.photo_url} alt="Profile" style={{ borderRadius: '50%', width: '100px' }} />
                  )}
                </Box>
              ) : (
                <Text>Loading user data from Telegram...</Text>
              )}

              {/* Routes for your app */}
              <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/master/:id" element={<MasterDetails />} />
              </Routes>
            </Box>
            <Box width="100%" height="64px">
              <Menu />
            </Box>
          </Flex>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
