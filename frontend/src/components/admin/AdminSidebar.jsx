import { FaTicketAlt } from 'react-icons/fa';
import { Box, VStack, Link, Icon } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const navItems = [
    {
      name: 'Dashboard',
      icon: FaHome,
      path: '/admin/dashboard'
    },
    {
      name: 'Manage Users',
      icon: FaUsers,
      path: '/admin/users'
    },
    {
      name: 'Manage Movies',
      icon: FaFilm,
      path: '/admin/movies'
    },
    {
      name: 'Manage Theatres',
      icon: FaTheaterMasks,
      path: '/admin/theatres'
    },
    {
      name: 'Manage Bookings',
      icon: FaTicketAlt,
      path: '/admin/bookings'
    },
    {
      name: 'Settings',
      icon: FaCog,
      path: '/admin/settings'
    }
  ];

  return (
    <Box as="nav" p={4} bg="gray.800" color="white" minH="100vh">
      <VStack spacing={4} align="stretch">
        {navItems.map((item) => (
          <Link
            as={NavLink}
            to={item.path}
            key={item.name}
            display="flex"
            alignItems="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: 'gray.700' }}
            _activeLink={{ bg: 'gray.700' }}
          >
            <Icon as={item.icon} mr={2} />
            {item.name}
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar;