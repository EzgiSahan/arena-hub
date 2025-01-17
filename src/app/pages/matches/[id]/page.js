"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PermanentDrawerLeft from "@/components/drawer.js";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  Toolbar,
  TextField,
} from "@mui/material";
import { fetchMatchDetails } from "@/store/matchStore/fetchMatchSlice";
import { fetchMatchPlayer } from "@/store/matchPlayerStore/fetchMatchPlayersSlice";
import { submitPlayerRating } from "@/store/playerRatingStore/createPlayerRatingSlice";
import { useSession } from "next-auth/react";
import { fetchPlayerRatings } from "@/store/playerRatingStore/fetchPlayerRatingSlice";
import { useRouter } from "next/navigation";
import { deleteMatch, updateMatch } from "@/store/matchStore/createMatchSlice";
import SignUpContainer from "@/components/container";

const MatchDetail = () => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const params = useParams();
    const router = useRouter();

    const matches = useSelector((state) => state.matches.matches);
    const matchPlayer = useSelector((state) => state.matchPlayer.matchPlayer);
    const playerRatings = useSelector((state) => state.playerRatings.playerRatings);

    const filteredMatch = matches?.find((match) => match.match_id._id === params.id) || null;
    const filteredPlayers = matchPlayer?.filter((player) => player.match_id === params.id);
    const findRatedPlayers = playerRatings?.filter((player) => player.match_id === params.id && player.rated_by_user_id === session.user.id);

    const team1Players = filteredPlayers?.filter((player) => player.team === 1) || [];
    const team2Players = filteredPlayers?.filter((player) => player.team === 2) || [];

    const [ratings, setRatings] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id && params.id) {
            dispatch(fetchMatchDetails(session.user.id));
            dispatch(fetchMatchPlayer(params.id));
            dispatch(fetchPlayerRatings({ match_id: params.id }));
        }
    }, [status, dispatch, session?.user?.id, params.id]);

    const handleRatingChange = (playerId, newValue) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [playerId]: newValue,
        }));
    };

    const handleSaveRatings = (event) => {
        event.preventDefault();
        if (session?.user?.id) {
            const playerRating = Object.entries(ratings).map(([playerId, rating]) => ({
                match_id: params.id,
                rated_user_id: playerId,
                rated_by_user_id: session.user.id,
                rating,
            }));
            console.log(playerRating);
            dispatch(submitPlayerRating(playerRating));
            router.push('/pages/matches');
        }
    };

    const handleUpdateScore = (event) => {
        const data = new FormData(event.currentTarget);
        if (session?.user?.id && params.id) {
            dispatch(
                updateMatch({
                    matchId: params.id,
                    team1_score: data.get("team1_score"),
                    team2_score: data.get("team2_score"),
                    match_hour: data.get("match_hour"),
                    match_date: data.get("match_date")
                })
            ).then(() => setEditMode(false));
        }
    };

    const handleDeleteMatch = async () => {
        const confirmDelete = window.confirm(
            "Bu maçı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        );
    
        if (confirmDelete) {
            try {
                dispatch(deleteMatch({matchId: params.id}));
                router.push('/pages/matches');
            } catch (error) {
                console.error("Maç silinirken bir hata oluştu:", error);
                alert("Maç silinirken bir hata oluştu.");
            }
        }
    };
    

    return (
        <SignUpContainer>
            <Box sx={{ display: "flex" }}>
                <PermanentDrawerLeft />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {filteredMatch ? (
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    sx={{ color: "text.secondary", fontSize: 14 }}
                                >
                                    {new Date(filteredMatch.match_id.match_date).toLocaleDateString()} -{" "} {filteredMatch.match_id.match_hour}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {filteredMatch.match_id.location}
                                </Typography>
                                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                                    {filteredMatch.match_id.team1_score} -{" "}
                                    {filteredMatch.match_id.team2_score}
                                </Typography>
                                {session?.user?.id === filteredMatch?.match_id?.created_by && (
                                    <>
                                        {editMode ? (
                                            <Box component="form" onSubmit={handleUpdateScore}>
                                                <Box
                                                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                                                >
                                                    <Typography sx={{ mb: 1 }}>Skorları Güncelle:</Typography>
                                                    <TextField
                                                        type="number"
                                                        id="team1_score"
                                                        name="team1_score"
                                                    />
                                                    <Typography>-</Typography>
                                                    <TextField
                                                        type="number"
                                                        id="team2_score"
                                                        name="team2_score"
                                                    />
                                                </Box>
                                                <Box
                                                    sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                                                >
                                                    <Typography>Saati Güncelle:</Typography>
                                                    <TextField
                                                        id="match_hour"
                                                        name="match_hour"
                                                        label="00.00"
                                                    />
                                                </Box>
                                                <Box
                                                    sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                                                >
                                                    <Typography>Tarihi Güncelle:</Typography>
                                                    <TextField
                                                        id="match_date"
                                                        name="match_date"
                                                        type="date"
                                                    />
                                                </Box>
                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        Kaydet
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ ml: 2 }}
                                                        onClick={() => setEditMode(false)}
                                                    >
                                                        İptal
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ mt: 2 }}
                                                    onClick={() => setEditMode(true)}
                                                >
                                                    Düzenle
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{ mt: 2, ml: 2 }}
                                                    onClick={handleDeleteMatch}
                                                >
                                                    Maçı Sil
                                                </Button>
                                            </>
                                            
                                        )}
                                    </>
                                )}
                            </CardContent>
                            {/* Players by Teams */}
                            <Box component="form" onSubmit={handleSaveRatings}>
                                <Box>
                                    <Typography variant="h6" sx={{ m: 2 }}>
                                        Takım 1
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                                        {team1Players.map((player) => (
                                            <Card
                                                key={player._id}
                                                sx={{
                                                    flex: "1 0 18%",
                                                    m: 1,
                                                    maxWidth: "18%",
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        {player.user_id.first_name}{" "}
                                                        {player.user_id.last_name}
                                                    </Typography>
                                                    <Typography
                                                        gutterBottom
                                                        sx={{ color: "text.secondary", fontSize: 14 }}
                                                    >
                                                        Pozisyon: {player.position}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ color: "text.secondary", mb: 1.5 }}
                                                    >
                                                        Rating:{" "}
                                                        {player.user_id.average_rating?.toFixed(1) ||
                                                            "N/A"}
                                                    </Typography>
                                                    {findRatedPlayers && findRatedPlayers.length > 0 ? (
                                                        <Rating
                                                            name={`player-rating-${player._id}`}
                                                            value={findRatedPlayers?.find((rating) => rating.rated_user_id === player.user_id._id)?.rating ?? 0}      
                                                            readOnly                                                                                                 
                                                        />
                                                    ) : (
                                                        <Rating
                                                        name={`player-rating-${player._id}`}
                                                        value={ratings[player.user_id._id] ?? 0}
                                                        onChange={(event, newValue) => 
                                                            handleRatingChange(player.user_id._id, newValue)
                                                        }
                                                    />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ m: 2 }}>
                                        Takım 2
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                                        {team2Players.map((player) => (
                                            <Card
                                                key={player._id}
                                                sx={{
                                                    flex: "1 0 18%",
                                                    m: 1,
                                                    maxWidth: "18%",
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        {player.user_id.first_name}{" "}
                                                        {player.user_id.last_name}
                                                    </Typography>
                                                    <Typography
                                                        gutterBottom
                                                        sx={{ color: "text.secondary", fontSize: 14 }}
                                                    >
                                                        Pozisyon: {player.position}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ color: "text.secondary", mb: 1.5 }}
                                                    >
                                                        Rating:{" "}
                                                        {player.user_id.average_rating?.toFixed(1) ||
                                                            "N/A"}
                                                    </Typography>
                                                    {findRatedPlayers && findRatedPlayers.length > 0 ? (
                                                        <Rating
                                                            name={`player-rating-${player._id}`}
                                                            value={ findRatedPlayers?.find((rating) => rating.rated_user_id === player.user_id._id)?.rating ?? 0}  
                                                            readOnly                                                   
                                                        />
                                                    ) : (
                                                        <Rating
                                                        name={`player-rating-${player._id}`}
                                                        value={ratings[player.user_id._id] ?? 0}
                                                        onChange={(event, newValue) => 
                                                            handleRatingChange(player.user_id._id, newValue)
                                                        }
                                                    />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                                {findRatedPlayers && findRatedPlayers.length > 0 ? ( 
                                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                                        Bu oyuncuları puanladınız.
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={Object.keys(ratings).length === 0}
                                    >
                                        Kaydet
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    ) : (
                        <Typography>Maç bilgisi bulunamadı.</Typography>
                    )}
                </Box>
            </Box>
        </SignUpContainer>
    );
};

export default MatchDetail;
