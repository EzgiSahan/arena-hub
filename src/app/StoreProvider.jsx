'use client';

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../lib/store/store";

export const StoreProvider = ({ children }) => {
    return <SessionProvider>
        <Provider store={store}> 
            {children}
        </Provider>
    </SessionProvider>
}