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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/movies/public');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Now Showing</Heading>
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
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </SimpleGrid>
    </Container>
  );
};

export default Home;