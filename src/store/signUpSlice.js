import { createSlice } from '@reduxjs/toolkit';

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
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { name, surname, email, password } = action.payload;
      state.name = name;
      state.surname = surname;
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
});

export const { setUser, resetUser, setError, clearError } = userSlice.actions;
export default userSlice.reducer;
