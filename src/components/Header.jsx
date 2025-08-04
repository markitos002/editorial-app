// components/Header.jsx
import {
  Box,
  Flex,
  Image,
  useColorModeValue
} from '@chakra-ui/react';

const Header = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      w="100%"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      height="140px"
    >
      <Flex
        h="100%"
        align="center"
        justify="space-between"
        maxW="100%"
      >
        {/* Banner principal - logoUT al lado izquierdo */}
        <Box 
          display="flex"
          alignItems="center"
          flex="1"
        >
          <Image
            src="/images/logoUT.png"
            alt="Universidad del Tolima"
            maxH="120px"
            maxW="800px"
            objectFit="contain"
            fallback={
              <Box
                h="120px"
                w="800px"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                color="gray.500"
              >
                Logo UT
              </Box>
            }
          />
        </Box>

        {/* Logo enfermería - esquina superior derecha */}
        <Box ml="auto">
          <Image
            src="/images/enfermeriaSF.png"
            alt="Enfermería"
            maxH="100px"
            maxW="160px"
            objectFit="contain"
            fallback={
              <Box
                h="100px"
                w="160px"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                color="gray.500"
              >
                Enfermería
              </Box>
            }
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
