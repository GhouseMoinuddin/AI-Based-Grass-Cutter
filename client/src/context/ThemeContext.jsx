import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to 'mower' (which is the original dark/blue theme)
    const [theme, setTheme] = useState('mower');

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Apply theme to html tag
        const root = window.document.documentElement;

        // Remove previous theme attributes if any specific cleanup is needed
        // For simple data-theme switch:
        root.setAttribute('data-theme', theme);

        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
