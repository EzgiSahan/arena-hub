"use client";

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError, clearError, signUpUser } from '../../../store/userStore/signUpSlice.ts';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '../../../components/card.js';
import SignUpContainer from '../../../components/container.js';
import { useRouter } from 'next/navigation';

export default function SignUp(props) {
  const dispatch = useDispatch();
  const { status, errors, errorMessage } = useSelector((state) => state.signUp);
  const router = useRouter();

  const validateInputs = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      dispatch(setError({ field: 'email', message: 'Please enter a valid email address.' }));
      isValid = false;
    } else {
      dispatch(clearError({ field: 'email' }));
    }

    if (!password || password.length < 6) {
      dispatch(setError({ field: 'password', message: 'Password must be at least 6 characters long.' }));
      isValid = false;
    } else {
      dispatch(clearError({ field: 'password' }));
    }

    if (!first_name || first_name.length < 1) {
      dispatch(setError({ field: 'name', message: 'Name is required.' }));
      isValid = false;
    } else {
      dispatch(clearError({ field: 'name' }));
    }

    if (!last_name || last_name.length < 1) {
      dispatch(setError({ field: 'surname', message: 'Surname is required.' }));
      isValid = false;
    } else {
      dispatch(clearError({ field: 'surname' }));
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const userData = {
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        email: data.get('email'),
        password: data.get('password'),
      };

      dispatch(setUser(userData));

      dispatch(signUpUser(userData))
        .then(() => {
          router.push('/pages/signIn');
        })
        .catch((error) => {
          console.error('Error during sign-up:', error);
        });
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <FormControl>
              <FormLabel htmlFor="first_name">Name</FormLabel>
              <TextField
                autoComplete="first_name"
                name="first_name"
                required
                fullWidth
                id="first_name"
                placeholder="Jon"
                error={Boolean(errors.name)}
                helperText={errors.name}
                color={errors.name ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="last_name">Surname</FormLabel>
              <TextField
                autoComplete="last_name"
                name="last_name"
                required
                fullWidth
                id="last_name"
                placeholder="Snow"
                error={Boolean(errors.surname)}
                helperText={errors.surname}
                color={errors.surname ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={errors.email}
                color={errors.email ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={Boolean(errors.password)}
                helperText={errors.password}
                color={errors.password ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
                <Link href="/pages/signIn" passHref>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{ alignSelf: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Sign in
                  </Typography>
                </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}
