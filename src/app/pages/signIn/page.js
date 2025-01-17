'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from 'next/link.js';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '../../../components/card.js';
import SignUpContainer from '../../../components/container.js';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword, setEmailError, setPasswordError } from '../../../store/signInSlice.ts';

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { email, password, emailError, passwordError } = useSelector((state) => state.form);

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      dispatch(setEmailError('Please enter a valid email address.'));
      isValid = false;
    } else {
      dispatch(setEmailError(''));
    }

    if (!password || password.length < 6) {
      dispatch(setPasswordError('Password must be at least 6 characters long.'));
      isValid = false;
    } else {
      dispatch(setPasswordError(''));
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      dispatch(setEmailError('Invalid credentials'));
      dispatch(setPasswordError('Please check your email or password.'));
    } else {
      router.push('/pages/profile');
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={Boolean(emailError)}
                helperText={emailError}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={Boolean(passwordError)}
                helperText={passwordError}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
                <Link href="/pages/signUp" passHref>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{ alignSelf: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Sign up
                  </Typography>
                </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}
