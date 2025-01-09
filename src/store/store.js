import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./SignIn/SignInSlice";
import userReducer from "./SignUp/SignUpSlice";

export const store = configureStore({
    reducer: {
        form: formReducer,
        user: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch; 