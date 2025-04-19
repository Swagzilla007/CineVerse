import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Badge,
  useToast,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  IconButton,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { DeleteIcon, ChevronDownIcon } from '@chakra-ui/icons';
import api from '../../services/api/axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/bookings/all');
      console.log('Bookings response:', response.data); // Add debugging
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      toast({
        title: 'Status updated',
        description: 'Booking status has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update booking status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'all' ? true : booking.status === statusFilter
  );

  const handleDelete = async (booking) => {
    setSelectedBooking(booking);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/bookings/${selectedBooking.id}`);
      toast({
        title: 'Booking deleted',
        description: 'The booking has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Failed to delete booking',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setSelectedBooking(null);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading bookings...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
        <Heading>Manage Bookings</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Status: {statusFilter === 'all' ? 'All' : statusFilter}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setStatusFilter('all')}>All</MenuItem>
            <MenuItem onClick={() => setStatusFilter('pending')}>Pending</MenuItem>
            <MenuItem onClick={() => setStatusFilter('confirmed')}>Confirmed</MenuItem>
            <MenuItem onClick={() => setStatusFilter('cancelled')}>Cancelled</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Booking Number</Th>
                <Th>User</Th>
                <Th>Movie</Th>
                <Th>Theatre</Th>
                <Th>Seat</Th>
                <Th>Date & Time</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBookings.map((booking) => (
                <Tr key={booking.id}>
                  <Td>{booking.booking_number}</Td>
                  <Td>{booking.user?.name}</Td>
                  <Td>{booking.screening?.movie?.title}</Td>
                  <Td>{booking.screening?.theatre?.name}</Td>
                  <Td>{booking.seat?.row}{booking.seat?.number}</Td>
                  <Td>{new Date(booking.screening?.start_time).toLocaleString()}</Td>
                  <Td>${booking.total_amount}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        booking.status === 'confirmed'
                          ? 'green'
                          : booking.status === 'cancelled'
                          ? 'red'
                          : 'yellow'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        size="sm"
                        width="150px"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="Delete booking"
                        size="sm"
                        onClick={() => handleDelete(booking)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Booking</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default ManageBookings;
