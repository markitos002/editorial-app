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
      height="80px"
    >
      <Flex
        h="100%"
        align="center"
        justify="space-between"
        maxW="100%"
        position="relative"
      >
        {/* Banner principal - logoUT centrado */}
        <Box 
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <Image
            src="/images/logoUT.png"
            alt="Universidad del Tolima"
            maxH="60px"
            maxW="400px"
            objectFit="contain"
            fallback={
              <Box
                h="60px"
                w="400px"
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
            src="/images/enfermeria.png"
            alt="Enfermería"
            maxH="50px"
            maxW="80px"
            objectFit="contain"
            fallback={
              <Box
                h="50px"
                w="80px"
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
