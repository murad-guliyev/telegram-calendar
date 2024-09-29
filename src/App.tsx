import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

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

      // Log the whole initDataUnsafe object to inspect
      console.log("Telegram WebApp initDataUnsafe:", webApp.initDataUnsafe);

      // Set the user data in state and log the user data
      if (userData) {
        setUser(userData);
        console.log("Telegram user data:", userData);
      } else {
        console.log("No user data available from Telegram.");
      }
    } else {
      console.log("Telegram WebApp is not available.");
    }
  }, []);

  return (
    <ChakraProvider>
      <div className="App">
        <Router>
          <Flex direction="column" height="100vh" gap={8}>
            <Box flex="1" p={4} overflowY="auto">
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
