import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./userStore/signInSlice";
import signUpReducer from "./userStore/signUpSlice";
import userReducer from "./userStore/fetchUserSlice";
import matchPlayersReducer from "./matchPlayerStore/fetchMatchPlayersSlice";
import createMatchReducer from "./matchStore/createMatchSlice";
import createMatchPlayerReducer from "./matchPlayerStore/createMatchPlayerSlice";
import fetchMatchDetailsReducer from "./matchStore/fetchMatchSlice";
import createMatcPlayerByEmailReducer from "./userStore/createUserByEmail";
import fetchPlayerRatingReducer from "./playerRatingStore/fetchPlayerRatingSlice";

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