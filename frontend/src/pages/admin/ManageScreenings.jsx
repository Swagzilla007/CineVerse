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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useDisclosure,
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

const ScreeningForm = ({ screening, onSubmit, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    movie_id: screening?.movie_id || '',
    theatre_id: screening?.theatre_id || '',
    start_time: screening?.start_time?.slice(0, 16) || '',
    end_time: screening?.end_time?.slice(0, 16) || '',
    price: screening?.price || '',
    is_active: screening?.is_active ?? true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [moviesRes, theatresRes] = await Promise.all([
          api.get('/movies/public'),
          api.get('/theatres/public')
        ]);
        setMovies(moviesRes.data);
        setTheatres(theatresRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load movies or theatres');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Movie</FormLabel>
          <Select
            name="movie_id"
            value={formData.movie_id}
            onChange={handleChange}
          >
            <option value="">Select Movie</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Theatre</FormLabel>
          <Select
            name="theatre_id"
            value={formData.theatre_id}
            onChange={handleChange}
          >
            <option value="">Select Theatre</option>
            {theatres.map(theatre => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Start Time</FormLabel>
          <Input
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>End Time</FormLabel>
          <Input
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="is_active" mb="0">
            Active
          </FormLabel>
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          {screening ? 'Update Screening' : 'Add Screening'}
        </Button>
      </Stack>
    </form>
  );
};

const ManageScreenings = () => {
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchScreenings();
  }, []);

  const fetchScreenings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try different endpoints until one works
      let response;
      let screeningsData = [];
      
      try {
        // First try - direct screenings endpoint
        response = await api.get('/screenings/public');
        screeningsData = response.data;
      } catch (firstError) {
        console.log('First endpoint failed, trying alternate endpoint');
        
        try {
          // Second try - get movies and extract screenings
          response = await api.get('/movies/public');
          
          if (response.data && Array.isArray(response.data)) {
            response.data.forEach(movie => {
              if (movie.screenings && Array.isArray(movie.screenings)) {
                const movieScreenings = movie.screenings.map(screening => ({
                  ...screening,
                  movie: {
                    id: movie.id,
                    title: movie.title,
                    poster_url: movie.poster_url,
                    duration: movie.duration
                  }
                }));
                screeningsData = [...screeningsData, ...movieScreenings];
              }
            });
          }
        } catch (secondError) {
          // If both fail, throw the original error
          throw firstError;
        }
      }
      
      setScreenings(screeningsData);
    } catch (error) {
      console.error('Error fetching screenings:', error);
      setError(`Failed to load screenings: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdit = async (formData) => {
    try {
      if (selectedScreening) {
        await api.put(`/screenings/${selectedScreening.id}`, formData);
        toast({
          title: 'Success',
          description: 'Screening updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/screenings', formData);
        toast({
          title: 'Success',
          description: 'Screening added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchScreenings();
      onClose();
      setSelectedScreening(null);
    } catch (error) {
      console.error('Screening save error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save screening',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this screening?')) {
      try {
        await api.delete(`/screenings/${id}`);
        toast({
          title: 'Success',
          description: 'Screening deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchScreenings();
      } catch (error) {
        console.error('Screening delete error:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete screening',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openModal = (screening = null) => {
    setSelectedScreening(screening);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Manage Screenings</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => openModal()}
          >
            Add Screening
          </Button>
        </Box>

        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading screenings...</Text>
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
                  <Th>Movie</Th>
                  <Th>Theatre</Th>
                  <Th>Start Time</Th>
                  <Th>End Time</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {screenings.length > 0 ? (
                  screenings.map((screening) => (
                    <Tr key={screening.id}>
                      <Td>{screening.movie?.title}</Td>
                      <Td>{screening.theatre?.name}</Td>
                      <Td>{new Date(screening.start_time).toLocaleString()}</Td>
                      <Td>{new Date(screening.end_time).toLocaleString()}</Td>
                      <Td>${screening.price}</Td>
                      <Td>
                        <Badge colorScheme={screening.is_active ? 'green' : 'red'}>
                          {screening.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit screening"
                          mr={2}
                          onClick={() => openModal(screening)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete screening"
                          colorScheme="red"
                          onClick={() => handleDelete(screening.id)}
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center">No screenings found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedScreening ? 'Edit Screening' : 'Add New Screening'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ScreeningForm
              screening={selectedScreening}
              onSubmit={handleAddEdit}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ManageScreenings;