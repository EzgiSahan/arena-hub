import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  name: '',
  surname: '',
  email: '',
  password: '',
  errors: {
    email: '',
    password: '',
    name: '',
    surname: '',
  },
  status: 'idle', // to track loading state
  errorMessage: '', // for general error handling
};

// Async thunk for user sign-up
export const signUpUser = createAsyncThunk(
  'signUpSlice/signUpUser',
  async (userData: { first_name: string; last_name: string; email: string; password: string }) => {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }
);

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setUser(state, action) {
      const { first_name, last_name, email, password } = action.payload;
      state.name = first_name;
      state.surname = last_name;
      state.email = email;
      state.password = password;
    },
    resetUser(state) {
      state.name = '';
      state.surname = '';
      state.email = '';
      state.password = '';
    },
    setError(state, action) {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
    clearError(state, action) {
      const { field } = action.payload;
      state.errors[field] = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = '';
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.name = action.payload.first_name;
        state.surname = action.payload.last_name;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.errorMessage = ''; // Clear any previous error messages
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message || 'Failed to sign up.';
      });
  },
});

export const { setUser, resetUser, setError, clearError } = signUpSlice.actions;
export default signUpSlice.reducer;
