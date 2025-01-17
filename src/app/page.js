"use client";

import * as React from 'react';
import SignUp from "./pages/signUp/page.js";
import SignIn from "./pages/signIn/page.js";
import Link from 'next/link'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation.js';
import { Button, CssBaseline, Typography } from '@mui/material';
import SignUpContainer from '@/components/container.js';
import Card from '@/components/card.js';


export default function Home() {
  const router = useRouter();

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
            Arena Hub
          </Typography>
          <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => {
                router.push('/pages/matches')
              }}
            >
              Get Start
            </Button>
      </Card>
      </SignUpContainer>
    </>
  );
}
