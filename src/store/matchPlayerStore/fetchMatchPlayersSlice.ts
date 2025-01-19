import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FetchPlayerRatingsParams {
  match_id: string; // or number
}

export const fetchMatchPlayer = createAsyncThunk(
  'matchPlayer/fetchMatchPlayer', 
  async ({ match_id }: FetchPlayerRatingsParams) => {
    console.log('Fetching user with ID:', match_id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matchPlayers?match_id=${match_id}`);
    const data = await response.json();
    console.log('API Response:', data);
    return data.players;
});

const matchPlayerSlice = createSlice({
  name: 'matchPlayer',
  initialState: {
    matchPlayer: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchPlayer.pending, (state) => {
        console.log('Fetch matchPlayer pending...');
        state.status = 'loading';
      })
      .addCase(fetchMatchPlayer.fulfilled, (state, action) => {
        console.log('Fetch matchPlayer succeeded:', action.payload);
        state.status = 'succeeded';
        state.matchPlayer = action.payload;
      })
      .addCase(fetchMatchPlayer.rejected, (state, action) => {
        console.log('Fetch matchPlayer failed:', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default matchPlayerSlice.reducer;
