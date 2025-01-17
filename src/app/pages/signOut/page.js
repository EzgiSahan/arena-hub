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
import  {signOut}  from "next-auth/react";
import { useRouter } from 'next/navigation';
import { CheckBox } from '@mui/icons-material';
import PermanentDrawerLeft from '@/components/drawer.js';

export default function SignOut() {

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          await signOut({ redirect: false }); 
          router.push('/pages/signUp'); 
        } catch (error) {
          console.error("Failed to sign out:", error);
        }
    };
    

    return (
        <Box sx={{ display: "flex" }}>
            <PermanentDrawerLeft />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <CssBaseline enableColorScheme />
          <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                align='center'
              >
                Çıkış Yap
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Çıkış Yap
                </Button>
              </Box>
            </Card>
          </SignUpContainer>
            </Box>
        </Box>
      );
}
    