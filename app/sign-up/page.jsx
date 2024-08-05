// pages/signup.js
'use client'
import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase'

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassowrd] = useCreateUserWithEmailAndPassword(auth);


  const handleSignUp = async() => {
    try {
        const res = await createUserWithEmailAndPassowrd(email, password);
        
        console.log({res})
        setEmail('');
        setPassword('')
        if (res) {
            // If the sign-in is successful, navigate to home page
            router.push('/sign-in');
          }

    }catch(e){
        console.error(e)
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
          Signup
        </Typography>
        {error && (
          <Typography color="error" variant="body2" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSignUp}>
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
            >
              Sign Up
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </Box>
  );
};

export default SignupPage;