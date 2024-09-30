import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex, Text, Button } from "@chakra-ui/react";

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

interface PopupEvent {
  button_id: string;
}

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [referrerId, setReferrerId] = useState<string | null>(null);  // Store referrer ID
  const [referralLink, setReferralLink] = useState<string | null>(null);  // Store the referral link
  const [copySuccess, setCopySuccess] = useState<string>("");  // Store copy status message

  useEffect(() => {
    // Initialize Telegram WebApp and fetch user data
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand(); // Expand the mini app

      // Access the user data from Telegram
      const initData = webApp.initDataUnsafe;
      const userData: TelegramUser = webApp.initDataUnsafe?.user;

      // Check for the referral parameter in the deep link (if any)
      const startParam = initData.query_id?.split("start=")[1];
      if (startParam && startParam.startsWith("ref_")) {
        const referrer = startParam.split("ref_")[1];  // Extract referrer ID
        setReferrerId(referrer);  // Store the referrer ID in state
        console.log(`Referred by user ID: ${referrer}`);
      }

      // Set the user data in state
      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  // Function to handle sharing the referral link using Telegram's popup
  const handleShareReferral = () => {
    if (user) {
      // Generate deep link with the user's Telegram ID
      const referrerId = user.id;  // This is the current user's Telegram ID
      const deepLink = `https://t.me/tg_scheduler_bot?start=ref_${referrerId}`;

      // Store the referral link in state for copying
      setReferralLink(deepLink);

      // Show the deep link in a popup (Telegram-provided)
      window.Telegram.WebApp.showPopup({
        title: "Öz cədvəlini paylaş",
        message: `Kopyala və paylaş: ${deepLink}`,
        buttons: [
          { id: "copyLink", type: "default", text: "Linki kopyala" },
          { id: "close", type: "close", text: "Close" },
        ],
      });

      // Attach an event handler for when the popup buttons are clicked
      window.Telegram.WebApp.onEvent("popupClosed", (event: PopupEvent) => {
        if (event.button_id === "copyLink") {
          // When the user clicks the "Copy Link" button, copy the referral link
          copyToClipboard();
        }
      });
    }
  };

  // Function to copy the referral link to the clipboard
  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setCopySuccess("Link kopyalandı!");  // Success message
      }, () => {
        setCopySuccess("Koplayan zaman xəta baş verdi!");  // Error message
      });
    }
  };

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

                  <Button mt={4} colorScheme="teal" onClick={handleShareReferral}>
                    Cədvəlini paylaş
                  </Button>

                  {/* Show the success message if the link was copied */}
                  {copySuccess && <Text mt={2}>{copySuccess}</Text>}
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
