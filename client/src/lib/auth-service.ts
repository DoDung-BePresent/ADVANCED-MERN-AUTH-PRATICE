import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./axios-client";

const AUTH_KEY = ["auth-user"] as const;

interface User {
  _id: string;
  name: string;
  email: string;
  userPreferences: {
    enable2FA: boolean;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface VerifyMFAData {
  code: string;
  email: string;
}

// Core auth service functions
const authService = {
  getCurrentUser: async () => {
    const res = await API.get<{ data: User }>("/user/current");
    return res.data.data;
  },

  login: async (data: LoginData) => {
    const res = await API.post("/auth/login", data);
    return res.data;
  },

  verifyMFA: async (data: VerifyMFAData) => {
    const res = await API.post("/auth/verify-mfa", data);
    return res.data;
  },

  register: async (data: RegisterData) => {
    const res = await API.post("/auth/register", data);
    return res.data;
  },

  logout: async () => {
    await API.post("/auth/logout");
  },
};

// Custom hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEY,
    queryFn: authService.getCurrentUser,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });

  const verifyMFAMutation = useMutation({
    mutationFn: authService.verifyMFA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEY, null);
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    verifyMFA: verifyMFAMutation.mutate,
    isVerifyMFAPending: verifyMFAMutation.isPending,
  };
};
