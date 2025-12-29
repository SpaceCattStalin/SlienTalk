import { ThemeContextType } from "@/types/ThemeTypes";
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext({} as ThemeContextType);

export const ThemeConsumer = ({ children }: { children: (context: ThemeContextType) => ReactNode; }) => (
    <ThemeContext.Consumer>
        {(context) => {
            if (!context) {
                throw new Error("ThemeConsumer must be used within a ThemeProvider");
            }
            return children(context);
        }}
    </ThemeContext.Consumer>
);

export const ThemeProvider = ({ children }: { children: ReactNode; }) => {
    const [theme, setTheme] = useState(Appearance.getColorScheme());

    const setAppMode = () => {
        setTheme(Appearance.getColorScheme());
    };

    const themeChangeListener = useCallback(() => {
        setTheme(Appearance.getColorScheme());
    }, []);

    useEffect(() => {
        const themeListener = Appearance.addChangeListener(themeChangeListener);
        return () => themeListener.remove();
    }, [themeChangeListener]);

    const memoizedValue = useMemo(() => ({
        theme,
        setAppMode
    }), [theme]);

    return (
        <ThemeContext.Provider value={memoizedValue}>
            {children}
        </ThemeContext.Provider>
    );
};