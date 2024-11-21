import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";

const stateContext = createContext({
    user: {}, 
    token: null,
    refreshToken: null,
    setUser: () => {},
    setToken: () => {},
    setRefreshToken: () => {},
});

export const ContextProvider = ({children}) => {
    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem('USER');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, _setToken] = useState(() => localStorage.getItem('ACCESS_TOKEN'));
    const [refreshToken, _setRefreshToken] = useState(() => localStorage.getItem('REFRESH_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setRefreshToken = (token) => {
        _setRefreshToken(token)
        if(token){
            localStorage.setItem('REFRESH_TOKEN',token);
        }
        else{
            localStorage.removeItem('REFRESH_TOKEN');
        }
    }

    const setUser = (user) => {
        _setUser(user);
        if (user) {
            localStorage.setItem('USER', JSON.stringify(user));
        } else {
            localStorage.removeItem('USER');
        }
    };

    return(
        <stateContext.Provider value={{
            user,
            token,
            refreshToken,
            setUser,
            setToken,
            setRefreshToken
        }}>
            {children}
        </stateContext.Provider>
    )
}

export const useStateContext = () => useContext(stateContext);