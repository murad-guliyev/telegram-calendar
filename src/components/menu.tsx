import { Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";

const Menu = () => {
  return (
    <Box as="nav" p={4} bg="blue.500" color="white">
      <Flex justify="space-around">
        <Link to="/">
          <Button variant="link" color="white">
            Axtar
          </Button>
        </Link>
        <Link to="/calendar">
          <Button variant="link" color="white">
            Cədvəl
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Menu;
