import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserByEmail = createAsyncThunk('user/fetchUserByEmail', async (email) => {
    console.log('Fetching user with ID:', email);
    const response = await fetch(`/api/userByEmail/${email}`);
    const data = await response.json();
    console.log('API Response:', data.user._id);
    return data.user;
  });

const createMatchPlayeByEmailSlice = createSlice({
    name: 'createMatchPlayerByEmail',
    initialState: {
      players: [],
      userEmails: {},
      loading: false,
      error: null,
    },
    reducers: {
      addPlayer: (state, action) => {
        state.players.push(action.payload);
      },
      resetPlayers: (state) => {
        state.players = [];
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserByEmail.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchUserByEmail.fulfilled, (state, action) => {
          state.loading = false;
          const { email, userId } = action.payload;
          state.userEmails[email] = userId;
        })
        .addCase(fetchUserByEmail.rejected, (state, action) => {
          state.loading = false;
          //state.error = action.payload.error;
        });
    },
  });
  
  export const { addPlayer, resetPlayers } = createMatchPlayeByEmailSlice.actions;
  
  export default createMatchPlayeByEmailSlice.reducer;