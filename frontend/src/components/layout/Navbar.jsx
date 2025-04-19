import { Box, Flex, Button, Heading, HStack, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Avatar, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ChevronDownIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} shadow="md">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Heading as={RouterLink} to="/" size="md" cursor="pointer">
            CineVerse
          </Heading>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button as={RouterLink} to="/" variant={'ghost'}>
              Movies
            </Button>
            {isAuthenticated && (
              <Button as={RouterLink} to="/my-bookings" variant={'ghost'}>
                My Bookings
              </Button>
            )}
            {isAdmin && (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
                  Admin
                </MenuButton>
                <MenuList>
                 
                  <MenuItem as={RouterLink} to="/admin/movies">Movies</MenuItem>
                  <MenuItem as={RouterLink} to="/admin/screenings">Screenings</MenuItem>
                  <MenuItem as={RouterLink} to="/admin/theatres">Theatres</MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
        </HStack>

        <HStack spacing={4}>
          {!isAuthenticated ? (
            <>
              <Button as={RouterLink} to="/login" variant={'ghost'}>
                Sign In
              </Button>
              <Button as={RouterLink} to="/register" colorScheme={'blue'}>
                Sign Up
              </Button>
            </>
          ) : (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <HStack>
                  <Avatar size="sm" name={user?.name} />
                  <Text display={{ base: 'none', md: 'block' }}>{user?.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/my-bookings">My Bookings</MenuItem>
                {isAdmin && <MenuItem as={RouterLink} to="/admin">Admin Dashboard</MenuItem>}
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar