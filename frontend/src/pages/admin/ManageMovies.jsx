import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  IconButton,
  Badge,
  Spinner,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import api from '../../services/api/axios';

const MovieForm = ({ movie, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    duration: movie?.duration || '',
    genre: movie?.genre || '',
    poster_url: movie?.poster_url || '',
    trailer_url: movie?.trailer_url || '',
    release_date: movie?.release_date || '',
    is_active: movie?.is_active ?? true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Duration</FormLabel>
          <Input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="2h 30min"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Genre</FormLabel>
          <Input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Poster URL</FormLabel>
          <Input
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Trailer URL</FormLabel>
          <Input
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Release Date</FormLabel>
          <Input
            name="release_date"
            type="date"
            value={formData.release_date}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          {movie ? 'Update Movie' : 'Add Movie'}
        </Button>
      </Stack>
    </form>
  );
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/api/movies/public');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(`Failed to load movies: ${error.response?.data?.message || error.message}`);
      toast({
        title: 'Error fetching movies',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdit = async (formData) => {
    try {
      if (selectedMovie) {
        await api.put(`/api/movies/${selectedMovie.id}`, formData);
        toast({
          title: 'Success',
          description: 'Movie updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/api/movies', formData);
        toast({
          title: 'Success',
          description: 'Movie added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchMovies();
      onClose();
      setSelectedMovie(null);
    } catch (error) {
      console.error('Movie save error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await api.delete(`/api/movies/${id}`);
        toast({
          title: 'Success',
          description: 'Movie deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchMovies();
      } catch (error) {
        console.error('Movie delete error:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openModal = (movie = null) => {
    setSelectedMovie(movie);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Manage Movies</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => openModal()}
          >
            Add Movie
          </Button>
        </Box>

        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading movies...</Text>
          </Box>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Genre</Th>
                  <Th>Duration</Th>
                  <Th>Release Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {movies.map((movie) => (
                  <Tr key={movie.id}>
                    <Td>{movie.title}</Td>
                    <Td>{movie.genre}</Td>
                    <Td>{movie.duration}</Td>
                    <Td>{new Date(movie.release_date).toLocaleDateString()}</Td>
                    <Td>
                      <Badge colorScheme={movie.is_active ? 'green' : 'red'}>
                        {movie.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit movie"
                        mr={2}
                        onClick={() => openModal(movie)}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete movie"
                        colorScheme="red"
                        onClick={() => handleDelete(movie.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <MovieForm
              movie={selectedMovie}
              onSubmit={handleAddEdit}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ManageMovies;