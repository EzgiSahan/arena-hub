import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  players: [],
  teams: [],
  status: "idle",
};

export const createMatchPlayer = createAsyncThunk(
  "createMatchPlayerSlice/createMatchPlayer",
  async (players) => {
    const response = await fetch("http://localhost:3000/api/matchPlayers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(players),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }

    return data;
  }
);


const createMatchPlayerSlice = createSlice({
  name: "createMatchPlayer",
  initialState,
  reducers: {
    addPlayer(state, action) {
      state.players.push(action.payload);
    },
    resetPlayers(state) {
      state.players = [];
    },
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    updatePlayerTeam: (state, action) => {
      const playerIndex = state.players.findIndex(
        (player) => player.user_id === action.payload.user_id
      );
      if (playerIndex !== -1) {
        state.players[playerIndex].team = action.payload.team;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMatchPlayer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMatchPlayer.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createMatchPlayer.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addPlayer, resetPlayers, setTeams, updatePlayerTeam } = createMatchPlayerSlice.actions;
export default createMatchPlayerSlice.reducer;
