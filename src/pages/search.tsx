import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Input,
  Text,
  Flex,
  Spinner,
  VStack,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { redirect, Link as RouterLink } from "react-router-dom";
import { getAllUsers } from "../services/user";
import { TFirebaseUser } from "../models/user";
import PageTitle from "../components/title";
import { useUser } from "../contexts/user";

const Search: React.FC = () => {
  const { referrerId } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [masters, setMasters] = useState<TFirebaseUser[]>([]);
  const [filteredMasters, setFilteredMasters] = useState<TFirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (referrerId) {
      redirect(`/master/${referrerId}`);
    }
  }, [referrerId]);

  useEffect(() => {
    const fetchMasters = async () => {
      const users = await getAllUsers();
      setMasters(users);
      setFilteredMasters(users);
      setLoading(false);
    };
    fetchMasters();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = masters.filter(
      (master) =>
        master.phone?.includes(value) ||
        master.username?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMasters(filtered);
  };

  return (
    <Box>
      <PageTitle title="Axtarış Sistemi" />

      {/* Search Input */}
      <Input
        placeholder="Adı və ya telefon nömrəsini daxil edin"
        value={searchTerm}
        onChange={handleSearch}
        mb={6}
        size="lg"
        boxShadow="md"
        borderColor="gray.300"
        _focus={{ borderColor: "blue.400" }}
      />

      {/* Loading Indicator */}
      {loading ? (
        <Flex justifyContent="center" mt={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        // Master List Container
        <VStack spacing={4} align="stretch">
          {/* Master Cards */}
          {filteredMasters.length > 0 ? (
            filteredMasters.map((master) => (
              <Box
                key={master.id}
                as={RouterLink}
                to={`/master/${master.id}`}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ boxShadow: "md", bg: "blue.50" }}
                bg="white"
                w="full"
              >
                <HStack spacing={4}>
                  {/* User Avatar (Smaller Size) */}
                  <Avatar
                    name={master.username || "Anonim"}
                    bg="blue.400"
                    size="md" // Changed size from "lg" to "md"
                  />

                  {/* Master Information */}
                  <VStack align="start" spacing={1} flex="1">
                    <Text fontWeight="bold" fontSize="lg">
                      {master.username || "Anonim"}
                    </Text>
                    <Text color="gray.600">
                      {master.phone ? `📞 ${master.phone}` : "Nömrə yoxdur"}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Text textAlign="center" fontSize="lg" color="red.500">
              Nəticə tapılmadı
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Search;
