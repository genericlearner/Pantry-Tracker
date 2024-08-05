'use client'

import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signInWithEmailAndPassword, user, loading, signInError] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors

    try {
      // Attempt to sign in with Firebase
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        // If the sign-in is successful, navigate to home page
        router.push('/inventory');
      }
    } catch (e) {
      // Enhanced error handling
      console.error('Sign-in error:', e);
      let errorMessage = 'Sign-in failed. Please check your email and password.';

      if (e.code) {
        switch (e.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'User account is disabled.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
      }

      setError(errorMessage);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography component="h1" variant="h5" align="center">
          Sign In
        </Typography>
        {error && (
          <Typography color="error" variant="body2" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSignIn}>
          <Box mt={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </Box>
          <Box mt={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </Box>
          <Box mt={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading} // Disable button while loading
            >
              Sign In
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </Box>
  );
};

export default SignInPage;