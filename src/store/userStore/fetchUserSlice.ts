import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
  console.log('Fetching user with ID:', userId);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
  const data = await response.json();
  console.log('API Response:', data);
  return data.user;
});

const userSlice = createSlice({
  name: 'userInfo',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        console.log('Fetch user pending...');
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log('Fetch user succeeded:', action.payload);
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log('Fetch user failed:', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
