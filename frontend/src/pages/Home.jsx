import { useState, useEffect } from 'react';
import {
  Container,
  SimpleGrid,
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  Skeleton,
  Alert,
  AlertIcon,
  Flex,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/axios';
import { useAuth } from '../contexts/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s' }}
    >
      <Image
        src={movie.poster_url || 'https://via.placeholder.com/300x450'}
        alt={movie.title}
        height="300px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {movie.genre}
          </Badge>
          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="gray.500"
          >
            {movie.duration}
          </Text>
        </Box>

        <Heading mt="1" fontSize="xl" fontWeight="semibold" lineHeight="short">
          {movie.title}
        </Heading>

        <Text mt={2} color="gray.500" noOfLines={2}>
          {movie.description}
        </Text>

        <Button
          mt={4}
          colorScheme="blue"
          width="full"
          onClick={() => navigate(`/movies/${movie.id}`)}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Adding timestamp to prevent caching issues
        const response = await api.get('/api/movies/public', {
          params: { _t: new Date().getTime() }
        });
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies. Please try again later.');
        toast({
          title: 'Error loading movies',
          description: 'Please try refreshing the page.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [toast]);

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8} textAlign="center">
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={() => navigate('/upcoming-movies')}
          mb={4}
        >
          View Upcoming Movies
        </Button>
      </Box>
      {isAuthenticated && (
        <Box mb={8}>
          <Alert status="success" borderRadius="md" mb={4}>
            <AlertIcon />
            Welcome back, {user.name}!
          </Alert>
        </Box>
      )}

      <Heading mb={8}>Now Showing</Heading>
      
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
        {isLoading
          ? Array(8)
              .fill('')
              .map((_, i) => (
                <Box key={i}>
                  <Skeleton height="300px" />
                  <Stack mt={4} spacing={2}>
                    <Skeleton height="20px" width="70%" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" width="60%" />
                  </Stack>
                </Box>
              ))
          : movies.length > 0 ? (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <Box gridColumn="span 4" textAlign="center" py={10}>
                <Text fontSize="lg">No movies are currently showing.</Text>
              </Box>
            )}
      </SimpleGrid>

      {isAuthenticated && user.role === 'admin' && (
        <Box mt={12}>
          <Heading size="md" mb={4}>Admin Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Button colorScheme="teal" onClick={() => navigate('/admin/movies')}>
              Manage Movies
            </Button>
            <Button colorScheme="orange" onClick={() => navigate('/admin/screenings')}>
              Manage Screenings
            </Button>
            <Button
              leftIcon={<FaTicketAlt />}
              onClick={() => navigate('/admin/bookings')}
              colorScheme="purple"
            >
              Manage Bookings
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </Container>
  );
};

export default Home;