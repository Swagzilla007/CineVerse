import { Box, Container, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Stack, Heading, useColorModeValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
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
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeScreenings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would have an endpoint to fetch all these stats
        const movies = await axios.get('http://localhost:8000/api/movies');
        const bookings = await axios.get('http://localhost:8000/api/bookings');
        const screenings = await axios.get('http://localhost:8000/api/screenings');

        const totalRevenue = bookings.data
          .filter(booking => booking.status === 'confirmed')
          .reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0);

        setStats({
          totalMovies: movies.data.length,
          totalBookings: bookings.data.length,
          totalRevenue: totalRevenue.toFixed(2),
          activeScreenings: screenings.data.filter(s => s.is_active).length
        });
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
            value={stats.totalMovies}
            helpText="Currently in system"
          />
          <StatCard
            title="Active Screenings"
            value={stats.activeScreenings}
            helpText="Currently scheduled"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            helpText="All time"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            helpText="From confirmed bookings"
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Dashboard;