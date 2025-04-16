import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  SimpleGrid,
  useToast,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:8000/api/movies/public/${id}`);
        setMovie(movieResponse.data);
        
        const screeningsResponse = await axios.get(`http://localhost:8000/api/screenings/public?movie_id=${id}`);
        setScreenings(screeningsResponse.data);
      } catch (error) {
        toast({
          title: 'Error fetching movie details',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, toast]);

  const handleBooking = (screeningId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to book tickets',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    navigate(`/booking/${screeningId}`);
  };

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  if (!movie) {
    return <Box p={8}>Movie not found</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
        <Box flex="1">
          <Image
            src={movie.poster_url || 'https://via.placeholder.com/500x750'}
            alt={movie.title}
            borderRadius="lg"
            objectFit="cover"
            width="100%"
            maxH="500px"
          />
        </Box>
        
        <Box flex="2">
          <Stack spacing={4}>
            <Heading size="xl">{movie.title}</Heading>
            <Stack direction="row" spacing={4}>
              <Badge colorScheme="blue">{movie.genre}</Badge>
              <Text>{movie.duration}</Text>
              <Text>Release Date: {new Date(movie.release_date).toLocaleDateString()}</Text>
            </Stack>
            
            <Text fontSize="lg">{movie.description}</Text>
            
            {movie.trailer_url && (
              <Button
                colorScheme="red"
                onClick={() => window.open(movie.trailer_url, '_blank')}
              >
                Watch Trailer
              </Button>
            )}

            <Divider my={6} />
            
            <Heading size="md" mb={4}>Available Screenings</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {screenings.map((screening) => (
                <Box
                  key={screening.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Stack>
                    <Text fontWeight="bold">
                      {new Date(screening.start_time).toLocaleString()}
                    </Text>
                    <Text>Theatre: {screening.theatre.name}</Text>
                    <Text>Price: ${screening.price}</Text>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleBooking(screening.id)}
                    >
                      Book Tickets
                    </Button>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default MovieDetails;