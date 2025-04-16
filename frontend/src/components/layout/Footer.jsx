import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={8}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2025 CineVerse. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Text>About</Text>
          <Text>Contact</Text>
          <Text>Terms</Text>
          <Text>Privacy</Text>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer