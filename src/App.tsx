import { ChakraProvider } from "@chakra-ui/react";

import "./App.css";
import Calendar from "./components/calendar";
function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <h1>React Big Calendar with TypeScript</h1>
        <Calendar />
      </div>
    </ChakraProvider>
  );
}

export default App;
