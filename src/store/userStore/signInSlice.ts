import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
      state.emailError = '';
    },
    setPassword: (state, action) => {
      state.password = action.payload;
      state.passwordError = '';
    },
    setEmailError: (state, action) => {
      state.emailError = action.payload;
    },
    setPasswordError: (state, action) => {
      state.passwordError = action.payload;
    },
  },
});

export const { setEmail, setPassword, setEmailError, setPasswordError } =
  formSlice.actions;

export default formSlice.reducer;
