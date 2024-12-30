import { createContext, ReactNode, useContext } from "react";
import { useAppwrite } from "./useAppwrite";
import { getCurrentUser } from "./appwrite";

interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

interface GlobalContextType {
    isloggedIn: boolean;
    user: User | null,
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const {
        data: user,
        loading,
        refetch
    } = useAppwrite({
        fn: getCurrentUser,
    })

    const isloggedIn = !!user

    return (
        <GlobalContext.Provider
            value={{
                isloggedIn,
                user,
                loading,
                refetch,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider")
    }
    return context;
}

export default GlobalProvider;