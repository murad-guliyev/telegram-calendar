import { Flex, IconButton } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { SearchIcon, CalendarIcon, SettingsIcon } from "@chakra-ui/icons";

const Menu = () => {
  const location = useLocation();

  const menuItems = [
    { to: "/", icon: <SearchIcon />, label: "Search", route: "/" },
    {
      to: "/calendar",
      icon: <CalendarIcon />,
      label: "Calendar",
      route: "/calendar",
    },
    {
      to: "/profile",
      icon: <SettingsIcon />,
      label: "Profile",
      route: "/profile",
    },
  ];

  return (
    <Flex
      justify="space-around"
      align="center"
      p={2}
      pb={4}
      bg="blue.500"
      color="white"
      position="fixed"
      bottom="0"
      width="100%"
      height="80px"
    >
      {menuItems.map((item) => (
        <IconButton
          key={item.to}
          as={RouterLink}
          to={item.to}
          aria-label={item.label}
          icon={item.icon}
          colorScheme="whiteAlpha"
          fontSize="20px"
          isRound
          variant={location.pathname === item.route ? "solid" : "ghost"}
          _hover={{
            bg: location.pathname === item.route ? "blue.700" : "blue.600",
          }}
          _active={{
            bg: "blue.800",
          }}
        />
      ))}
    </Flex>
  );
};

export default Menu;
