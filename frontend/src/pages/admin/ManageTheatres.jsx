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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  Badge,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Switch,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import api from '../../services/api/axios';

const TheatreForm = ({ theatre, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: theatre?.name || '',
    capacity: theatre?.capacity || '',
    screen_type: theatre?.screen_type || '',
    is_active: theatre?.is_active ?? true,
  });

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

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Capacity</FormLabel>
          <NumberInput
            min={1}
            value={formData.capacity}
            onChange={(value) => setFormData(prev => ({ ...prev, capacity: value }))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Screen Type</FormLabel>
          <Select
            name="screen_type"
            value={formData.screen_type}
            onChange={handleChange}
          >
            <option value="">Select Screen Type</option>
            <option value="Regular">Regular</option>
            <option value="IMAX">IMAX</option>
            <option value="3D">3D</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="is_active" mb="0">
            Active
          </FormLabel>
          <Switch
            id="is_active"
            name="is_active"
            isChecked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          {theatre ? 'Update Theatre' : 'Add Theatre'}
        </Button>
      </Stack>
    </form>
  );
};

const SeatManagementModal = ({ theatre, isOpen, onClose }) => {
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (theatre && isOpen) {
      fetchSeats();
    }
  }, [theatre, isOpen]);

  const fetchSeats = async () => {
    if (!theatre) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/theatres/${theatre.id}/seats`);
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('Failed to load seats');
      toast({
        title: 'Error fetching seats',
        description: error.response?.data?.message || 'Failed to load seats',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    try {
      setIsLoading(true);
      await api.post(`/seats/bulk-create`, {
        theatre_id: theatre.id,
        rows: 10,
        seats_per_row: 20,
        type: 'regular'
      });
      toast({
        title: 'Success',
        description: 'Seats created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchSeats();
    } catch (error) {
      console.error('Error creating seats:', error);
      toast({
        title: 'Error creating seats',
        description: error.response?.data?.message || 'Failed to create seats',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const organizedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Seats - {theatre?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Heading size="md">Seat Layout</Heading>
              <Button 
                colorScheme="blue" 
                onClick={handleBulkCreate}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Generate Default Layout
              </Button>
            </Box>

            {isLoading ? (
              <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading seats...</Text>
              </Box>
            ) : error ? (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            ) : (
              <Box p={4} borderWidth={1} borderRadius="lg">
                {Object.keys(organizedSeats).length > 0 ? (
                  Object.entries(organizedSeats).map(([row, rowSeats]) => (
                    <Grid key={row} templateColumns="repeat(20, 1fr)" gap={2} mb={2}>
                      {rowSeats
                        .sort((a, b) => a.number - b.number)
                        .map(seat => (
                          <Box
                            key={seat.id}
                            p={2}
                            bg={seat.status === 'available' ? 'green.100' : 'red.100'}
                            borderRadius="md"
                            textAlign="center"
                          >
                            {row}{seat.number}
                          </Box>
                        ))}
                    </Grid>
                  ))
                ) : (
                  <Text textAlign="center">No seats found. Generate a default layout to create seats.</Text>
                )}
              </Box>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen: isTheatreModalOpen, onOpen: onTheatreModalOpen, onClose: onTheatreModalClose } = useDisclosure();
  const { isOpen: isSeatModalOpen, onOpen: onSeatModalOpen, onClose: onSeatModalClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/theatres');
      setTheatres(response.data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
      setError('Failed to load theatres');
      toast({
        title: 'Error fetching theatres',
        description: error.response?.data?.message || 'Failed to load theatres',
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
      if (selectedTheatre) {
        await api.put(`/theatres/${selectedTheatre.id}`, formData);
        toast({
          title: 'Success',
          description: 'Theatre updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/theatres', formData);
        toast({
          title: 'Success',
          description: 'Theatre added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchTheatres();
      onTheatreModalClose();
      setSelectedTheatre(null);
    } catch (error) {
      console.error('Theatre save error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save theatre',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this theatre?')) {
      try {
        await api.delete(`/theatres/${id}`);
        toast({
          title: 'Success',
          description: 'Theatre deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTheatres();
      } catch (error) {
        console.error('Theatre delete error:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete theatre',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openTheatreModal = (theatre = null) => {
    setSelectedTheatre(theatre);
    onTheatreModalOpen();
  };

  const openSeatModal = (theatre) => {
    setSelectedTheatre(theatre);
    onSeatModalOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Manage Theatres</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => openTheatreModal()}
          >
            Add Theatre
          </Button>
        </Box>

        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading theatres...</Text>
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
                  <Th>Name</Th>
                  <Th>Capacity</Th>
                  <Th>Screen Type</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {theatres.length > 0 ? (
                  theatres.map((theatre) => (
                    <Tr key={theatre.id}>
                      <Td>{theatre.name}</Td>
                      <Td>{theatre.capacity}</Td>
                      <Td>{theatre.screen_type}</Td>
                      <Td>
                        <Badge colorScheme={theatre.is_active ? 'green' : 'red'}>
                          {theatre.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<ViewIcon />}
                          aria-label="View seats"
                          mr={2}
                          onClick={() => openSeatModal(theatre)}
                        />
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit theatre"
                          mr={2}
                          onClick={() => openTheatreModal(theatre)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete theatre"
                          colorScheme="red"
                          onClick={() => handleDelete(theatre.id)}
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center">No theatres found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Stack>

      <Modal isOpen={isTheatreModalOpen} onClose={onTheatreModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTheatre ? 'Edit Theatre' : 'Add New Theatre'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TheatreForm
              theatre={selectedTheatre}
              onSubmit={handleAddEdit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <SeatManagementModal
        theatre={selectedTheatre}
        isOpen={isSeatModalOpen}
        onClose={onSeatModalClose}
      />
    </Container>
  );
};

export default ManageTheatres;