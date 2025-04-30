"use client"
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadMeRequest } from "./http";


export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const getUser = useCallback(async () => {
        try {
            const res = await loadMeRequest();
            setUser(res.data.user);
            setIsAuthenticated(true);

        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        getUser()
    }, []);


    return (
        <UserContext.Provider value={{setUser, user, loading, isAuthenticated, setIsAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
