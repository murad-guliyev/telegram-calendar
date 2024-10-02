import { Text } from "@chakra-ui/react";

interface IProps {
  title: string;
}

const PageTitle: React.FC<IProps> = ({ title }) => {
  return (
    <Text fontSize="2xl" fontWeight="bold" mb={6}>
      {title}
    </Text>
  );
};

export default PageTitle;
