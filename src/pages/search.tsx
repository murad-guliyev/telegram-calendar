// src/pages/Search.tsx
import React, { useState } from "react";
import { Box, Input, List, ListItem, Link, Text, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

// Sample data for masters
const masters = [
  { id: 1, name: "Kamran", phone: "+994501234567" },
  { id: 2, name: "Gəzənfər", phone: "+994551234567" },
  { id: 3, name: "Murad", phone: "+994701234567" },
  { id: 4, name: "Aygül", phone: "+994771234567" },
];

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMasters, setFilteredMasters] = useState(masters);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter masters based on the search term
    const filtered = masters.filter((master) => master.phone.includes(value));
    setFilteredMasters(filtered);
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Axtarış
      </Text>

      {/* Input for phone number search */}
      <Input
        placeholder="Telefon nömrəsini daxil edin"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
      />

      {/* Display filtered results */}
      <List spacing={3}>
        {filteredMasters.map((master) => (
          <ListItem key={master.id}>
            <Link as={RouterLink} to={`/master/${master.id}`}>
              <Flex justify="space-between">
                <Text>{master.name}</Text>
                <Text>{master.phone}</Text>
              </Flex>
            </Link>
          </ListItem>
        ))}

        {/* No results found */}
        {filteredMasters.length === 0 && <Text>Nəticə tapılmadı</Text>}
      </List>
    </Box>
  );
};

export default Search;
