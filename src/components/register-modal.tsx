import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string, phone: string) => void;
  initialUsername?: string;
  initialPhone?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUsername = "",
  initialPhone = "",
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    setUsername(initialUsername);
    setPhone(initialPhone);
  }, [initialUsername, initialPhone]);

  const handleSave = () => {
    if (username && phone) {
      onSave(username, phone);
      onClose();
    } else {
      alert("Zəhmət olmasa, bütün sahələri doldurun");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Qeydiyyat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="username" mb={4}>
            <FormLabel>İstifadəçi adı</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="İstifadəçi adını daxil edin"
            />
          </FormControl>
          <FormControl id="phone" mb={4}>
            <FormLabel>Telefon nömrəsi</FormLabel>
            <PhoneInput
              country={"az"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputStyle={{
                width: "100%",
                fontSize: "16px",
              }}
              placeholder="Telefon nömrəsini daxil edin"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Qeydiyyatdan keç
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
