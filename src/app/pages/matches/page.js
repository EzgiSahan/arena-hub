"use client";

import React, { useEffect } from "react";
import PermanentDrawerLeft from "@/components/drawer.js";
import {
  Box,
  Toolbar,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  ListItemButton,
  CssBaseline,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMatchDetails,
  resetMatchState,
} from "../../../store/matchStore/fetchMatchSlice";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Link from "next/link";
import SignUpContainer from "@/components/container";
import Layout from "@/components/layout";

const Matches = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const matches = useSelector((state) => state.matches.matches);
  const fetchStatus = useSelector((state) => state.matches.status);
  const error = useSelector((state) => state.matches.error);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      dispatch(fetchMatchDetails(session.user.id));
    }
  }, [status, dispatch, session]);

  return (
    <SignUpContainer>
      <Layout>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          Kayıtlı Olduğunuz Maçlar
        </Typography>

        {fetchStatus === "loading" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {fetchStatus === "failed" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {fetchStatus === "succeeded" && matches && (
          <List sx={{ bgcolor: "background.paper" }}>
            {matches.map((match) => (
              <ListItem key={match._id}>
                <Divider></Divider>
                <ListItemAvatar>
                  <Avatar>
                    <SportsSoccerIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "black" }}
                  primary={match.match_id.location}
                  secondary={new Date(
                    match.match_id.match_date
                  ).toLocaleDateString()}
                />
                <Link
                  href={`/pages/matches/${match.match_id._id}`}
                  style={{ color: "black" }}
                >
                  Details
                </Link>
              </ListItem>
            ))}
          </List>
        )}
        {fetchStatus === "succeeded" && matches.length === 0 && (
          <Typography variant="body1" sx={{ mt: 2, color: "black" }}>
            Henüz kayıtlı olduğunuz bir maç bulunmamaktadır.
          </Typography>
        )}
      </Layout>
    </SignUpContainer>
  );
};

export default Matches;
