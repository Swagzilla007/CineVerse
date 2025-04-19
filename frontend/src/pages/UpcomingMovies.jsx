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
      image: 'https://sportshub.cbsistatic.com/i/2023/06/08/04e7d7a5-76a7-4d25-98d8-787b4683205c/superman-legacy-new-details.jpg',
      releaseDate: 'July 11, 2025',
      description: 'Superman: Legacy tells the story of Superman\'s journey to reconcile his Kryptonian heritage with his human upbringing as Clark Kent of Smallville, Kansas.',
      genre: 'Action, Adventure',
      director: 'James Gunn'
    },
    {
      id: 2,
      title: 'Jurassic World: Rebirth',
      image: 'https://dm.henkel-dam.com/is/image/henkel/jurassic-world-dominion-review-2022-jpg',
      releaseDate: 'June 23, 2025',
      description: 'In a world where dinosaurs now live and hunt alongside humans, the delicate balance of coexistence threatens to reshape the future of humanity.',
      genre: 'Action, Adventure, Sci-Fi',
      director: 'Colin Trevorrow'
    },
    {
      id: 3,
      title: 'Mission Impossible: The Final Reckoning',
      image: 'https://www.hollywoodreporter.com/wp-content/uploads/2023/05/Mission-Impossible-Dead-Reckoning-Part-One-Paramount-Publicity-H-2023.jpg',
      releaseDate: 'May 23, 2025',
      description: 'Ethan Hunt returns for one last mission in this epic conclusion. With the fate of the world hanging in the balance.',
      genre: 'Action, Thriller, Spy',
      director: 'Christopher McQuarrie'
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8} textAlign="center" fontSize="3xl">
        Coming Soon to CineVerse
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {upcomingMovies.map((movie) => (
          <Box
            key={movie.id}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            bg="white"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
          >
            <Box position="relative" height="400px">
              <Image
                src={movie.image}
                alt={movie.title}
                objectFit="cover"
                width="100%"
                height="100%"
              />
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme="red"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                Coming Soon
              </Badge>
            </Box>
            <Box p={6}>
              <Stack spacing={4}>
                <Heading size="lg" noOfLines={2}>
                  {movie.title}
                </Heading>
                <Stack direction="row" spacing={2}>
                  <Badge colorScheme="blue">{movie.genre}</Badge>
                </Stack>
                <Text fontWeight="semibold" color="gray.600">
                  Release Date: {movie.releaseDate}
                </Text>
                <Text fontWeight="medium" color="gray.600">
                  Director: {movie.director}
                </Text>
                <Text color="gray.600" noOfLines={3}>
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
