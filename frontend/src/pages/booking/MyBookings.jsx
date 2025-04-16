import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Stack,
  Text,
  Badge,
  SimpleGrid,
  useToast,
  Button,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const BookingCard = ({ booking }) => {
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      _hover={{ boxShadow: 'md' }}
    >
      <Stack spacing={3}>
        <Heading size="md">{booking.screening.movie.title}</Heading>
        <Stack direction="row" spacing={2} align="center">
          <Text fontWeight="bold">Date:</Text>
          <Text>{new Date(booking.screening.start_time).toLocaleString()}</Text>
        </Stack>
        <Stack direction="row" spacing={2} align="center">
          <Text fontWeight="bold">Theatre:</Text>
          <Text>{booking.screening.theatre.name}</Text>
        </Stack>
        <Stack direction="row" spacing={2} align="center">
          <Text fontWeight="bold">Seat:</Text>
          <Text>{booking.seat.row}{booking.seat.number}</Text>
        </Stack>
        <Stack direction="row" spacing={2} align="center">
          <Text fontWeight="bold">Booking Number:</Text>
          <Text>{booking.booking_number}</Text>
        </Stack>
        <Stack direction="row" spacing={2} align="center">
          <Text fontWeight="bold">Status:</Text>
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
        </Stack>
        <Text fontWeight="bold">
          Total Amount: ${booking.total_amount}
        </Text>
      </Stack>
    </Box>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/bookings');
        setBookings(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching bookings',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  if (bookings.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Stack spacing={4} align="center">
          <Heading size="lg">My Bookings</Heading>
          <Text>You haven't made any bookings yet.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Browse Movies
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <Heading size="lg">My Bookings</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default MyBookings;