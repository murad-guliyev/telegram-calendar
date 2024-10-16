import React from "react";
import { Box, Flex, IconButton, Button, Select } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { format, parse, isToday } from "date-fns";
import { az } from "date-fns/locale";

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: string) => void;
  view: string; // Current view prop to reflect the state in Select
  showViewSwitcher?: boolean; // Toggle for showing view switcher
  currentDate: Date; // Current calendar date for comparison
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  label,
  onNavigate,
  onView,
  view,
  currentDate,
  showViewSwitcher = true,
}) => {
  // Function to format the current date in Azerbaijani format
  const formatCurrentDate = (date: Date) =>
    format(date, "dd MMMM", { locale: az });

  // Function to format the label into Azerbaijani
  const formatLabel = (label: string) => {
    try {
      const parsedDate = parse(label, "EEEE MMM dd", new Date());
      return format(parsedDate, "eeee - dd MMMM", { locale: az });
    } catch (error) {
      return label;
    }
  };

  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Previous"
            onClick={() => onNavigate("PREV")}
          />
          <Button
            ml={2}
            colorScheme={isToday(currentDate) ? "blue" : "gray"}
            onClick={() => onNavigate("TODAY")}
          >
            {formatCurrentDate(new Date())}
          </Button>
          <IconButton
            icon={<ArrowForwardIcon />}
            aria-label="Next"
            ml={2}
            onClick={() => onNavigate("NEXT")}
          />
        </Flex>
        {showViewSwitcher && (
          <Select
            ml={2}
            width="120px"
            value={view}
            onChange={(e) => onView(e.target.value)}
          >
            <option value="day">1 Gün</option>
            <option value="week">1 Həftə</option>
            <option value="month">1 Ay</option>
          </Select>
        )}
      </Flex>
      <Box fontWeight="bold" fontSize="lg">
        {formatLabel(label)}
      </Box>
    </Box>
  );
};

export default CustomToolbar;
