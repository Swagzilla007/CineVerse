import { Box, Flex, Button, Heading, HStack, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  // TODO: Replace with actual auth state
  const isLoggedIn = false
  const isAdmin = false

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Heading as={RouterLink} to="/" size="md" cursor="pointer">
            CineVerse
          </Heading>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button as={RouterLink} to="/" variant={'ghost'}>
              Movies
            </Button>
            {isLoggedIn && (
              <Button as={RouterLink} to="/my-bookings" variant={'ghost'}>
                My Bookings
              </Button>
            )}
            {isAdmin && (
              <Button as={RouterLink} to="/admin" variant={'ghost'}>
                Dashboard
              </Button>
            )}
          </HStack>
        </HStack>

        <HStack spacing={4}>
          {!isLoggedIn ? (
            <>
              <Button as={RouterLink} to="/login" variant={'ghost'}>
                Sign In
              </Button>
              <Button as={RouterLink} to="/register" colorScheme={'blue'}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button variant={'ghost'}>
              Sign Out
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar