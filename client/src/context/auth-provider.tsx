import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: {
    enable2FA: boolean;
  };
};

type AuthContextType = {
  user?: UserType;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
  });

  const user = data?.data;
  console.log(user);
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
