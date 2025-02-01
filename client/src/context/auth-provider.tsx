import useAuth from "@/hooks/use-auth";
import { createContext, useContext } from "react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

type AuthContextType = {
  user?: UserType;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useAuth();
  const user = data?.data;
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
