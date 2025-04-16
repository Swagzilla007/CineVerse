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
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const ScreeningForm = ({ screening, onSubmit, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
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
        const [moviesRes, theatresRes] = await Promise.all([
          axios.get('http://localhost:8000/api/movies'),
          axios.get('http://localhost:8000/api/theatres')
        ]);
        setMovies(moviesRes.data);
        setTheatres(theatresRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchScreenings();
  }, []);

  const fetchScreenings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/screenings');
      setScreenings(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching screenings',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddEdit = async (formData) => {
    try {
      if (selectedScreening) {
        await axios.put(`http://localhost:8000/api/screenings/${selectedScreening.id}`, formData);
        toast({
          title: 'Success',
          description: 'Screening updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post('http://localhost:8000/api/screenings', formData);
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
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this screening?')) {
      try {
        await axios.delete(`http://localhost:8000/api/screenings/${id}`);
        toast({
          title: 'Success',
          description: 'Screening deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchScreenings();
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
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
              {screenings.map((screening) => (
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
              ))}
            </Tbody>
          </Table>
        </Box>
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