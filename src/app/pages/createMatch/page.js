"use client";

import {
  Box,
  TextField,
  Button,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import PermanentDrawerLeft from "@/components/drawer.js";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  addPlayer,
  resetPlayers,
  createMatchPlayer,
  setTeams,
  updatePlayerTeam,
} from "@/store/matchPlayerStore/createMatchPlayerSlice";
import { createMatch, setMatch } from "@/store/matchStore/createMatchSlice";
import { fetchUserByEmail } from "@/store/userStore/createUserByEmail";
import { useRouter } from "next/navigation";
import { submitPlayerRating } from "@/store/playerRatingStore/createPlayerRatingSlice";
import SignUpContainer from "@/components/container";
import { useState } from "react";
import { dividePlayersIntoTeams } from "@/store/matchPlayerStore/dividePlayersIntoTeamsSlice";
import Layout from "@/components/layout";

const CreateMatch = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isPlayerFormActive, setIsPlayerFormActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const date = useSelector((state) => state.createMatch.date);
  const location = useSelector((state) => state.createMatch.location);
  const matchId = useSelector((state) => state.createMatch.matchId);

  const players = useSelector((state) => state.createMatchPlayer.players);

  const validateInputs = () => {
    const match_date = document.getElementById("match_date").value;
    const location = document.getElementById("location").value;

    if (!match_date || !location) {
      alert("Lütfen maç tarihi ve lokasyon bilgilerini doldurun.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const matchData = {
        match_date: data.get("match_date"),
        created_by: session.user.id,
        location: data.get("location"),
        match_hour: data.get("match_hour"),
      };

      try {
        await dispatch(setMatch(matchData));
        setIsPlayerFormActive(true); // Oyuncu formunu aktif hale getir
        await dispatch(createMatch(matchData));
      } catch (error) {
        console.error("Maç bilgileri kaydedilirken hata oluştu:", error);
      }
    }
  };

  const handlePlayerChange = async (event, position) => {
    const email = event.target.value;

    if (!email) {
      return;
    }

    try {
      const result = await dispatch(fetchUserByEmail(email));
      if (result.payload?._id) {
        const playerExists = players.some(
          (player) => player.user_id === result.payload._id
        );

        if (playerExists) {
          alert("Bu kullanıcı zaten eklendi.");
          return;
        }

        const player = {
          position,
          match_id: matchId,
          user_id: result.payload._id,
        };
        dispatch(addPlayer(player));
      } else {
        alert("Girilen email ile bir kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Kullanıcı bilgisi alınırken hata oluştu:", error);
    }
  };

  const handlePlayerSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
     try {
      await dispatch(createMatchPlayer(players)).then(() => {
        dispatch(dividePlayersIntoTeams({ matchId: matchId })).then(() => {
          dispatch(resetPlayers());
          setIsLoading(false); 
          router.push(`/pages/matches`);
        });
      });
    } catch (error) {
      console.error("Oyuncular kaydedilirken hata oluştu:", error);
      setIsLoading(false); 
    }
  };

  const positions = [
    { title: "Kaleci", count: 2 },
    { title: "Stoper", count: 4 },
    { title: "Bek", count: 4 },
    { title: "Ön Libero", count: 2 },
    { title: "Orta Saha", count: 4 },
    { title: "Forvet", count: 4 },
    { title: "Santrofor", count: 2 },
  ];

  return (
    <SignUpContainer>
      <Layout>
        <Toolbar />
        {/* Maç Formu */}
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          Maç Formu
        </Typography>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <TextField
            id="location"
            name="location"
            label="Maç Yeri"
            variant="outlined"
          />
          <TextField
            id="match_date"
            name="match_date"
            variant="outlined"
            type="date"
          />
          <TextField
            id="match_hour"
            name="match_hour"
            variant="outlined"
            label="00:00"
          />
          <Button type="submit" variant="contained">
            Maç bilgilerini kaydet
          </Button>
        </Box>

        {/* Oyuncu Formu */}
        {isPlayerFormActive && (
          <Box component="form" onSubmit={handlePlayerSubmit}>
            <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
              Oyuncu Formu
            </Typography>
            {positions.map((positionGroup) => (
              <Accordion key={positionGroup.title}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`${positionGroup.title}-content`}
                  id={`${positionGroup.title}-header`}
                >
                  <Typography component="span" sx={{ color: "black" }}>
                    {positionGroup.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                    noValidate
                    autoComplete="off"
                  >
                    {[...Array(positionGroup.count)].map((_, index) => (
                      <TextField
                        key={index}
                        id={`${positionGroup.title}-${index}`}
                        label={`${positionGroup.title} ${index + 1} email`}
                        variant="outlined"
                        onBlur={(e) =>
                          handlePlayerChange(e, positionGroup.title)
                        }
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <Button type="submit" fullWidth variant="contained">
              {isLoading ? "Maç oluşturuluyor..." : "Oyuncu bilgilerini kaydet"}            
            </Button>
          </Box>
        )}
      </Layout>
    </SignUpContainer>
  );
};

export default CreateMatch;
