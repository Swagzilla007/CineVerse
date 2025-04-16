import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Stack,
  useToast,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const SeatButton = ({ seat, isSelected, onSelect }) => (
  <Button
    size="sm"
    colorScheme={seat.status === 'available' ? (isSelected ? 'green' : 'gray') : 'red'}
    isDisabled={seat.status !== 'available'}
    onClick={() => onSelect(seat)}
    w="40px"
    h="40px"
  >
    {seat.number}
  </Button>
);

const BookingPage = () => {
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [screening, setScreening] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchScreeningDetails = async () => {
      try {
        const screeningResponse = await axios.get(`http://localhost:8000/api/screenings/${screeningId}`);
        setScreening(screeningResponse.data);
        
        const seatsResponse = await axios.get(`http://localhost:8000/api/screenings/${screeningId}/available-seats`);
        setSeats(seatsResponse.data);
      } catch (error) {
        toast({
          title: 'Error fetching screening details',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreeningDetails();
  }, [screeningId, toast]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: 'No seats selected',
        description: 'Please select at least one seat to book',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsBooking(true);
    try {
      const bookingPromises = selectedSeats.map(seat =>
        axios.post('http://localhost:8000/api/bookings', {
          screening_id: screeningId,
          seat_id: seat.id,
          user_id: user.id
        })
      );

      await Promise.all(bookingPromises);

      toast({
        title: 'Booking successful',
        description: 'Your tickets have been booked successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/my-bookings');
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading || !screening) {
    return <Box p={8}>Loading...</Box>;
  }

  const organizedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const totalPrice = selectedSeats.length * screening.price;

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <Box>
          <Heading size="lg">{screening.movie.title}</Heading>
          <Text mt={2}>
            {new Date(screening.start_time).toLocaleString()} - Theatre: {screening.theatre.name}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Select Seats</Heading>
          <VStack spacing={4} align="center">
            <Box
              bg="gray.100"
              p={4}
              borderRadius="md"
              width="100%"
              maxW="600px"
              textAlign="center"
            >
              <Text mb={4}>SCREEN</Text>
            </Box>
            
            <VStack spacing={2}>
              {Object.entries(organizedSeats).map(([row, rowSeats]) => (
                <HStack key={row} spacing={2}>
                  <Text fontWeight="bold" w="30px">{row}</Text>
                  {rowSeats
                    .sort((a, b) => a.number - b.number)
                    .map(seat => (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some(s => s.id === seat.id)}
                        onSelect={handleSeatSelect}
                      />
                    ))}
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Box>

        <Box borderWidth={1} p={4} borderRadius="md">
          <Stack spacing={4}>
            <Heading size="sm">Booking Summary</Heading>
            <Text>Selected Seats: {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}</Text>
            <Text>Price per ticket: ${screening.price}</Text>
            <Text fontWeight="bold">Total Price: ${totalPrice}</Text>
            <Button
              colorScheme="blue"
              isLoading={isBooking}
              isDisabled={selectedSeats.length === 0}
              onClick={handleBooking}
            >
              Confirm Booking
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default BookingPage;