import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitPlayerRating = createAsyncThunk(
    "createMatchPlayerSlice/createMatchPlayer",
    async (playerRatings) => {
      const response = await fetch("http://localhost:3000/api/playerRatings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerRatings),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
      return data;
    }
);

const playerRatingsSlice = createSlice({
  name: 'playerRatings',
  initialState: {
    ratings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitPlayerRating.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitPlayerRating.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ratings.push(action.payload);
      })
      .addCase(submitPlayerRating.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default playerRatingsSlice.reducer;
