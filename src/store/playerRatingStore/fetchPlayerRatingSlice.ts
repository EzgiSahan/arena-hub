import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FetchPlayerRatingsParams {
  match_id: string; // or number
}

export const fetchPlayerRatings = createAsyncThunk(
  'playerRatings/fetchPlayerRatings',
  async ({ match_id }: FetchPlayerRatingsParams) => {
    console.log("match_id:", match_id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playerRatings?match_id=${match_id}`);
    const data = await response.json();
    console.log("API Response in Thunk:", data);
    return data.users;  
  }
);


const playerRatingSlice = createSlice({
  name: 'playerRatings',
  initialState: {
    playerRatings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerRatings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayerRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playerRatings = action.payload || [];
        console.log("API Response:", action.payload);
      })
      .addCase(fetchPlayerRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default playerRatingSlice.reducer;
