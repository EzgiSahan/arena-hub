import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  date: '',
  created_by: '',
  location: '',
  matchId: null,
  team1_score: 0,
  team2_score: 0,
  status: 'idle',
};

export const createMatch = createAsyncThunk(
  'createMatchSlice/createMatch',
  async (matchData: { match_date: string; created_by: string; location: string;}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }
);

export const updateMatch = createAsyncThunk(
  'createMatchSlice/updateMatch',
  async ({
    matchId,
    team1_score,
    team2_score,
    match_hour,
    match_date,
  }: {
    matchId: string;
    team1_score?: string | null;
    team2_score?: string | null;
    match_hour?: string | null;
    match_date?: string | null;
  }) => {
    const updateData: { [key: string]: any } = {};

    if (team1_score !== undefined && team1_score !== null && team1_score !== '') {
      updateData.team1_score = team1_score;
    }
    if (team2_score !== undefined && team2_score !== null && team2_score!== '') {
      updateData.team2_score = team2_score;
    }
    if (match_hour !== undefined && match_hour.trim() !== "") {
      updateData.match_hour = match_hour;
    }
    if (match_date !== undefined && match_date.trim() !== "") {
      updateData.match_date = match_date;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    const response = await fetch(`http://localhost:3000/api/matches/${matchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update match!");
    }

    return data;
  }
);

export const deleteMatch = createAsyncThunk(
  'createMatchSlice/createMatch',
  async ({matchId}: { matchId: string}) => {
    const response = await fetch(`http://localhost:3000/api/matches/${matchId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }
);

const createMatchSlice = createSlice({
  name: 'createMatch',
  initialState,
  reducers: {
    setMatch(state, action) {
      const { match_date, created_by, location, matchId } = action.payload;
      state.date = match_date;
      state.created_by = created_by;
      state.location = location;
      state.matchId = matchId;
    },
    resetMatch(state) {
      state.date = '';
      state.created_by = '';
      state.location = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.date = action.payload.match_date;
        state.created_by = action.payload.created_by;
        state.location = action.payload.location;
        state.matchId = action.payload.matchId;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.status = 'failed';
      }).addCase(updateMatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.matchId === action.payload.matchId) {
          state.team1_score = action.payload.team1_score;
          state.team2_score = action.payload.team2_score;
        }
      })
      .addCase(updateMatch.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setMatch, resetMatch } = createMatchSlice.actions;
export default createMatchSlice.reducer;
