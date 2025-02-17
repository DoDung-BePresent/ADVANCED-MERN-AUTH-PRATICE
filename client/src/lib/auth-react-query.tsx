import {
  type QueryFunction,
  type MutationFunction,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface AuthConfig<User, LoginData, RegisterData> {
  // Core API functions
  getCurrentUser: QueryFunction<User>;
  login: MutationFunction<User, LoginData>;
  register: MutationFunction<User, RegisterData>;
  logout: MutationFunction<any, void>;
}

export function createAuthService<
  User = any,
  LoginData = any,
  RegisterData = any,
>(config: AuthConfig<User, LoginData, RegisterData>) {
  const AUTH_KEY = ["auth-user"];

  // Hook để lấy current user
  const useUser = () => {
    return useQuery({
      queryKey: AUTH_KEY,
      queryFn: config.getCurrentUser,
    });
  };

  // Hook xử lý login
  const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: config.login,
      onSuccess: (user) => {
        queryClient.setQueryData(AUTH_KEY, user);
      },
    });
  };

  // Hook xử lý register
  const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: config.register,
      onSuccess: (user) => {
        queryClient.setQueryData(AUTH_KEY, user);
      },
    });
  };

  // Hook xử lý logout
  const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: config.logout,
      onSuccess: () => {
        queryClient.setQueryData(AUTH_KEY, null);
      },
    });
  };

  // Simple AuthGuard component
  const AuthGuard = ({
    children,
    fallback = <div>Loading...</div>,
  }: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) => {
    const { data: user, isLoading } = useUser();

    if (isLoading) return <>{fallback}</>;
    if (!user) return null;

    return <>{children}</>;
  };

  return {
    useUser,
    useLogin,
    useRegister,
    useLogout,
    AuthGuard,
  };
}
