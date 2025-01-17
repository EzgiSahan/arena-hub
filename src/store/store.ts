import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./signInSlice";
import signUpReducer from "./signUpSlice";
import userReducer from "./fetchUserSlice";
import matchPlayersReducer from "./fetchMatchPlayersSlice";
import createMatchReducer from "./createMatchSlice";
import createMatchPlayerReducer from "./createMatchPlayerSlice";
import fetchMatchDetailsReducer from "./fetchMatchSlice";
import createMatcPlayerByEmailReducer from "./createUserByEmail";
import fetchPlayerRatingReducer from "./fetchPlayerRatingSlice";

export const store = configureStore({
    reducer: {
        form: signInReducer,
        signUp: signUpReducer,
        userInfo: userReducer,
        matches: fetchMatchDetailsReducer,
        matchPlayer: matchPlayersReducer,
        createMatch: createMatchReducer,
        createMatchPlayer: createMatchPlayerReducer,
        createMatchPlayerByEmail: createMatcPlayerByEmailReducer,
        playerRatings: fetchPlayerRatingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch; 