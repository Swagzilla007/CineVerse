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
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';

const TheatreForm = ({ theatre, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: theatre?.name || '',
    capacity: theatre?.capacity || '',
    screen_type: theatre?.screen_type || '',
    is_active: theatre?.is_active ?? true,
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

        <Button type="submit" colorScheme="blue">
          {theatre ? 'Update Theatre' : 'Add Theatre'}
        </Button>
      </Stack>
    </form>
  );
};

const SeatManagementModal = ({ theatre, isOpen, onClose }) => {
  const [seats, setSeats] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (theatre) {
      fetchSeats();
    }
  }, [theatre]);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/theatres/${theatre.id}/seats`);
      setSeats(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching seats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBulkCreate = async () => {
    try {
      await axios.post(`http://localhost:8000/api/seats/bulk-create`, {
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
      toast({
        title: 'Error creating seats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
              <Button colorScheme="blue" onClick={handleBulkCreate}>
                Generate Default Layout
              </Button>
            </Box>

            <Box p={4} borderWidth={1} borderRadius="lg">
              {Object.entries(organizedSeats).map(([row, rowSeats]) => (
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
              ))}
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const { isOpen: isTheatreModalOpen, onOpen: onTheatreModalOpen, onClose: onTheatreModalClose } = useDisclosure();
  const { isOpen: isSeatModalOpen, onOpen: onSeatModalOpen, onClose: onSeatModalClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/theatres');
      setTheatres(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching theatres',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddEdit = async (formData) => {
    try {
      if (selectedTheatre) {
        await axios.put(`http://localhost:8000/api/theatres/${selectedTheatre.id}`, formData);
        toast({
          title: 'Success',
          description: 'Theatre updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post('http://localhost:8000/api/theatres', formData);
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
    if (window.confirm('Are you sure you want to delete this theatre?')) {
      try {
        await axios.delete(`http://localhost:8000/api/theatres/${id}`);
        toast({
          title: 'Success',
          description: 'Theatre deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTheatres();
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
              {theatres.map((theatre) => (
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
              ))}
            </Tbody>
          </Table>
        </Box>
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