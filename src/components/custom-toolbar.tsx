// src/components/CustomToolbar.tsx
import React from "react";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CalendarIcon,
} from "@chakra-ui/icons"; // Import Chakra UI Icons

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: string) => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  label,
  onNavigate,
  onView,
}) => {
  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        {/* Navigation Buttons with Chakra UI Icons */}
        <Flex>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Previous"
            onClick={() => onNavigate("PREV")}
          />
          <IconButton
            icon={<CalendarIcon />}
            aria-label="Today"
            ml={2}
            colorScheme="blue"
            onClick={() => onNavigate("TODAY")}
          />
          <IconButton
            icon={<ArrowForwardIcon />}
            aria-label="Next"
            ml={2}
            onClick={() => onNavigate("NEXT")}
          />
        </Flex>

        {/* View Buttons (Day, Week, Month) */}
        <Flex>
          <Button ml={2} onClick={() => onView("day")}>
            Gün
          </Button>
          <Button ml={2} onClick={() => onView("week")}>
            Həftə
          </Button>
        </Flex>
      </Flex>

      {/* Current Date Label */}
      <Box fontWeight="bold" fontSize="lg">
        {label}
      </Box>
    </Box>
  );
};

export default CustomToolbar;
