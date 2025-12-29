// context/NavContext.tsx
import React, { createContext, useContext, useState } from "react";

type NavContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const NavContext = createContext<NavContextType | null>(null);

export const NavProvider = ({ children }: { children: React.ReactNode; }) => {
    const [activeTab, setActiveTab] = useState("home");
    return (
        <NavContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </NavContext.Provider>
    );
};

export const useNav = () => {
    const ctx = useContext(NavContext);
    if (!ctx) throw new Error("useNav must be used inside NavProvider");
    return ctx;
};
