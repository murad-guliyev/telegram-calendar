import React from "react";
import { Box, Flex, IconButton, Button, Select } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { format, parse } from "date-fns";
import { az } from "date-fns/locale";

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: string) => void;
  view: string; // Current view prop to reflect the state in Select
  showViewSwitcher?: boolean; // Toggle for showing view switcher
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  label,
  onNavigate,
  onView,
  view,
  showViewSwitcher = true,
}) => {
  // Function to parse and format the label into Azerbaijani
  const formatLabel = (label: string) => {
    try {
      // Parse the label into a Date object
      const parsedDate = parse(label, "EEEE MMM dd", new Date());

      // Format the date into Azerbaijani format: "Cümə axşamı - 03 oktyabr"
      return format(parsedDate, "eeee - dd MMMM", { locale: az });
    } catch (error) {
      // If parsing fails, return the original label
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
          <Button ml={2} colorScheme="blue" onClick={() => onNavigate("TODAY")}>
            Bugün
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
            value={view} // Use view prop to control Select value
            onChange={(e) => onView(e.target.value)}
          >
            <option value="day">1 Gün</option>
            <option value="week">1 Həftə</option>
            <option value="month">1 Ay</option>
          </Select>
        )}
      </Flex>
      <Box fontWeight="bold" fontSize="lg">
        {/* Format and translate the label */}
        {formatLabel(label)}
      </Box>
    </Box>
  );
};

export default CustomToolbar;
