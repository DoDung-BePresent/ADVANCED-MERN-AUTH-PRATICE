import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext } from "react";

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
  error: Error | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
  });

  const login = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(() => {
    queryClient.setQueryData(["authUser"], null);
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{ user: data?.data, isLoading, error, login, logout }}
    >
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
