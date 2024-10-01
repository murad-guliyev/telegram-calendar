import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Link,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getAllUsers } from "../services/user";
import { TFirebaseUser } from "../models/user";

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [masters, setMasters] = useState<TFirebaseUser[]>([]);
  const [filteredMasters, setFilteredMasters] = useState<TFirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Axtarış
      </Text>

      <Input
        placeholder="Adı və ya telefon nömrəsini daxil edin"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
      />

      {loading ? (
        <Flex justifyContent="center" mt={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <List spacing={3}>
          {filteredMasters.map((master) => (
            <ListItem key={master.id}>
              <Link as={RouterLink} to={`/master/${master.id}`}>
                <Flex justify="space-between">
                  <Text>{master.username || "Anonim"}</Text>
                  <Text>{master.phone}</Text>
                </Flex>
              </Link>
            </ListItem>
          ))}

          {filteredMasters.length === 0 && <Text>Nəticə tapılmadı</Text>}
        </List>
      )}
    </Box>
  );
};

export default Search;
