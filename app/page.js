'use client';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
    <Container component="main" maxWidth="m">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor="#f5f5f5"
        p={4}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Inventory Manager
        </Typography>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignIn}
            sx={{ marginRight: 2 }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}