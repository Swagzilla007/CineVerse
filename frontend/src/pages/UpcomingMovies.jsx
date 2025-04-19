import {
  Container,
  SimpleGrid,
  Box,
  Image,
  Heading,
  Text,
  Badge,
  Stack,
} from '@chakra-ui/react';

const UpcomingMovies = () => {
  const upcomingMovies = [
    {
      id: 1,
      title: 'Superman: Legacy',
      image: 'https://www.kakuchopurei.com/wp-content/uploads/2024/12/Superman-Poster.jpeg',
      releaseDate: 'July 11, 2025',
      description: 'Superman: Legacy tells the story of Superman\'s journey to reconcile his Kryptonian heritage with his human upbringing as Clark Kent of Smallville, Kansas.',
      genre: 'Action, Adventure',
      director: 'James Gunn'
    },
    {
      id: 2,
      title: 'Jurassic World: Rebirth',
      image: 'https://posterspy.com/wp-content/uploads/2024/09/Jurassic-World-Rebirth.jpg',
      releaseDate: 'June 23, 2025',
      description: 'In a world where dinosaurs now live and hunt alongside humans, the delicate balance of coexistence threatens to reshape the future of humanity.',
      genre: 'Action, Adventure, Sci-Fi',
      director: 'Colin Trevorrow'
    },
    {
      id: 3,
      title: 'Mission Impossible: The Final Reckoning',
      image: 'https://www.dropthespotlight.com/wp-content/uploads/2025/04/missionimpossiblethefinal.jpg',
      releaseDate: 'May 23, 2025',
      description: 'Ethan Hunt returns for one last mission in this epic conclusion. With the fate of the world hanging in the balance.',
      genre: 'Action, Thriller, Spy',
      director: 'Christopher McQuarrie'
    }
  ];

  return (
    <Container maxW="container.xl" py={12} px={4}>
      <Heading 
        mb={12} 
        textAlign="center" 
        fontSize={{ base: "3xl", md: "4xl" }}  // reduced from 4xl/5xl to 3xl/4xl
        fontWeight="extrabold"
        bgGradient="linear(to-r, blue.400, purple.500)"
        bgClip="text"
      >
        Coming Soon to CineVerse
      </Heading>
      <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 3 }} 
        spacing={10}
        mx="auto"
      >
        {upcomingMovies.map((movie) => (
          <Box
            key={movie.id}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            bg="white"
            transition="all 0.4s ease-in-out"
            _hover={{ 
              transform: 'translateY(-8px)', 
              boxShadow: 'dark-lg',
              cursor: 'pointer'
            }}
          >
            <Box position="relative" height="450px">
              <Image
                src={movie.image}
                alt={movie.title}
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.05)' }}
              />
              <Badge
                position="absolute"
                top={6}
                right={6}
                colorScheme="red"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
                boxShadow="md"
                backdropFilter="blur(4px)"
                backgroundColor="rgba(229, 62, 62, 0.85)"
                color="white"
              >
                Coming Soon
              </Badge>
            </Box>
            <Box p={8} bg="gray.50">
              <Stack spacing={5}>
                <Heading 
                  size="lg" 
                  noOfLines={2}
                  fontWeight="bold"
                  color="gray.800"
                >
                  {movie.title}
                </Heading>
                <Stack direction="row" spacing={2}>
                  {movie.genre.split(', ').map((g, index) => (
                    <Badge 
                      key={index}
                      colorScheme="blue"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {g}
                    </Badge>
                  ))}
                </Stack>
                <Text 
                  fontWeight="bold" 
                  color="gray.700"
                  fontSize="md"
                >
                  Release Date: {movie.releaseDate}
                </Text>
                <Text 
                  fontWeight="medium" 
                  color="gray.700"
                >
                  Director: {movie.director}
                </Text>
                <Text 
                  color="gray.600" 
                  noOfLines={3}
                  fontSize="md"
                  lineHeight="tall"
                >
                  {movie.description}
                </Text>
              </Stack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default UpcomingMovies;
