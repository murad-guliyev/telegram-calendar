import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";

import Calendar from "./pages/calendar";

import "./App.css";
import Search from "./pages/search";
import Menu from "./components/menu";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Router>
          <Flex direction="column" height="100vh" gap={8}>
            <Box flex="1" p={4} overflowY="auto">
              <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/calendar" element={<Calendar />} />
              </Routes>
            </Box>
            <Box width="100%">
              <Menu />
            </Box>
          </Flex>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
