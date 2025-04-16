import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Stack,
  Heading,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';

const StatCard = ({ title, value, helpText }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
      <Stat>
        <StatLabel fontSize="lg">{title}</StatLabel>
        <StatNumber fontSize="3xl">{value}</StatNumber>
        {helpText && <StatHelpText>{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    summary: {
      totalMovies: 0,
      activeScreenings: 0,
      totalBookings: 0,
      totalRevenue: 0
    },
    recentBookings: [],
    popularMovies: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stats/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading>Admin Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            title="Total Movies"
            value={stats.summary.totalMovies}
            helpText="Currently in system"
          />
          <StatCard
            title="Active Screenings"
            value={stats.summary.activeScreenings}
            helpText="Currently scheduled"
          />
          <StatCard
            title="Total Bookings"
            value={stats.summary.totalBookings}
            helpText="All time"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.summary.totalRevenue?.toFixed(2)}`}
            helpText="From confirmed bookings"
          />
        </SimpleGrid>

        <Divider />

        <Stack spacing={4}>
          <Heading size="md">Recent Bookings</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Booking ID</Th>
                  <Th>User</Th>
                  <Th>Movie</Th>
                  <Th>Theatre</Th>
                  <Th>Seat</Th>
                  <Th>Status</Th>
                  <Th>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.recentBookings.map((booking) => (
                  <Tr key={booking.id}>
                    <Td>{booking.booking_number}</Td>
                    <Td>{booking.user.name}</Td>
                    <Td>{booking.screening.movie.title}</Td>
                    <Td>{booking.screening.theatre.name}</Td>
                    <Td>{booking.seat.row}{booking.seat.number}</Td>
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
                    <Td>${booking.total_amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Stack>

        <Divider />

        <Stack spacing={4}>
          <Heading size="md">Popular Movies</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Movie</Th>
                  <Th>Genre</Th>
                  <Th>Release Date</Th>
                  <Th>Total Bookings</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.popularMovies.map((movie) => (
                  <Tr key={movie.id}>
                    <Td>{movie.title}</Td>
                    <Td>{movie.genre}</Td>
                    <Td>{new Date(movie.release_date).toLocaleDateString()}</Td>
                    <Td>{movie.screenings_bookings_count}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Dashboard;