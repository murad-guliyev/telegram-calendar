import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import { UserProvider } from "./contexts/user";

import Calendar from "./pages/calendar";
import Search from "./pages/search";
import Profile from "./pages/profile";
import MasterDetails from "./pages/master-details";
import Menu from "./components/menu";
// import UserInfo from "./components/userInfo";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <UserProvider>
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
      </UserProvider>
    </ChakraProvider>
  );
};

export default App;
