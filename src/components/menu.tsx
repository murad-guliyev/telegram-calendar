import React from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { SearchIcon, CalendarIcon, SettingsIcon } from "@chakra-ui/icons";
import { useUser } from "../contexts/user";

const Menu = () => {
  const { user } = useUser();
  const location = useLocation();

  const menuItems = [
    { to: "/", icon: <SearchIcon />, label: "Axtarış", route: "/" },
    {
      to: "/calendar",
      icon: <CalendarIcon />,
      label: "Cədvəl",
      route: "/calendar",
    },
    {
      to: "/profile",
      icon: <SettingsIcon />,
      label: "Profil",
      route: "/profile",
    },
  ];

  // Conditionally remove Profile if user is not logged in
  if (!user?.firebaseData) {
    menuItems.pop(); // Remove profile menu item if no user data is present
  }

  return (
    <Flex
      justify="space-around"
      align="center"
      p={4} // Reduced padding
      pt={2} // Reduced padding
      bg="blue.600"
      color="white"
      position="fixed"
      bottom="0"
      width="100%"
      boxShadow="0px -2px 10px rgba(0,0,0,0.1)"
      zIndex={1000}
    >
      {menuItems.map((item) => (
        <Flex
          key={item.to}
          as={RouterLink}
          to={item.to}
          direction="column"
          align="center"
          justify="center"
          fontSize="12px" // Smaller text size
          _hover={{ textDecoration: "none", color: "white" }}
        >
          <IconButton
            aria-label={item.label}
            icon={item.icon}
            colorScheme="whiteAlpha"
            fontSize="20px" // Smaller icon size
            variant="unstyled"
            bg={location.pathname === item.route ? "blue.700" : "transparent"}
            _hover={{
              bg: location.pathname === item.route ? "blue.800" : "blue.500",
            }}
            _active={{
              bg: "blue.800",
            }}
            mb={1}
            isRound
          />
          <Text
            fontSize="xs" // Smaller label size
            color={location.pathname === item.route ? "white" : "gray.300"}
          >
            {item.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Menu;
