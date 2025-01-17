import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMatchDetails = createAsyncThunk(
    "matches/fetchMatchDetails",
    async (matchId) => {
        console.log(matchId);
        const response = await fetch(`/api/matches/${matchId}`);
        const data = await response.json();
        return data.userMatches; 
    }
);


const matchesSlice = createSlice({
    name: "matches",
    initialState: {
        matches: null,
        /* players: [], */
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMatchDetails.pending, (state) => {
                console.log('Fetch user pending...');
                state.status = 'loading';
                state.error = null;
            })
            .addCase( fetchMatchDetails.fulfilled, (state, action/* : PayloadAction<Match[]> */) => {
                    console.log('Fetch user succeeded:', action.payload);
                    state.matches = action.payload;
                    state.status = 'succeeded';
            })
            .addCase(fetchMatchDetails.rejected, (state, action) => {
                console.log('Fetch user failed:', action.error.message);
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong.';
            });
    },
});


export default matchesSlice.reducer;
