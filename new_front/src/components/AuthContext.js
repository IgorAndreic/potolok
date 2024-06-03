import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // Try to get auth state from localStorage
        const localAuth = localStorage.getItem('auth');
        return localAuth ? JSON.parse(localAuth) : { isAuthenticated: false, user: null };
    });

    const login = (user) => {
        const newAuth = { isAuthenticated: true, user };
        setAuth(newAuth);
        localStorage.setItem('auth', JSON.stringify(newAuth)); // Save new auth state to localStorage
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, user: null });
        localStorage.removeItem('auth'); // Clear auth state from localStorage
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
