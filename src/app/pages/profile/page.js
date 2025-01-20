"use client";

import React, { useEffect } from "react";
import PermanentDrawerLeft from "@/components/drawer.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Card from "../../../components/card.js";
import Link from "next/link.js";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import SignUpContainer from "../../../components/container.js";
import { fetchUser } from "@/store/userStore/fetchUserSlice";
import Layout from "@/components/layout.js";

const Profile = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userInfo.user);
  const fetchStatus = useSelector((state) => state.userInfo.status);
  const error = useSelector((state) => state.userInfo.error);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      dispatch(fetchUser(session.user.id));
    }
  }, [status, session, dispatch]);

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Layout>
        <Toolbar />
        {fetchStatus === "loading" && (
          <Typography>Loading user information...</Typography>
        )}
        {fetchStatus === "failed" && <Typography>Error: {error}</Typography>}
        {fetchStatus === "succeeded" && user && (
          <Box>
            <CssBaseline enableColorScheme />
            <Card variant="outlined">
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
              >
                Welcome, {user.first_name} {user.last_name}
              </Typography>
              <Divider></Divider>
              <Typography sx={{ width: "100%", fontSize: 20 }}>
                Email: {user.email}
              </Typography>
              <Typography sx={{ width: "100%", fontSize: 20 }}>
                Your Average Rating: {user.average_rating}
              </Typography>
            </Card>
          </Box>
        )}
        {status !== "authenticated" && (
          <Typography>Please log in to view your information.</Typography>
        )}
      </Layout>
    </SignUpContainer>
  );
};

export default Profile;
