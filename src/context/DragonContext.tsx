import { createContext, useContext, useState, ReactNode } from "react";

type Dragon = {
    id: string;
    name: string;
    type: string;
    createdAt: string;
};

type DragonContextType = {
    dragon: Dragon | null;
    setDragon: (dragon: Dragon | null) => void;
};

const DragonContext = createContext<DragonContextType>({
    dragon: null,
    setDragon: () => { },
});

export function useDragonContext() {
    return useContext(DragonContext);
}

export function DragonProvider({ children }: { children: ReactNode }) {
    const [dragon, setDragon] = useState<Dragon | null>(null);

    return (
        <DragonContext.Provider value={{ dragon, setDragon }}>
            {children}
        </DragonContext.Provider>
    );
}