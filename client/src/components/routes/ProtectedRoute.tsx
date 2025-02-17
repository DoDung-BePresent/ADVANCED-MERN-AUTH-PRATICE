import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";
import LoadingScreen from "@/components/LoadingScreen";

type ProtectedRouteProps = {
  isPublic?: boolean;
  redirectPath?: string;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  isPublic = false,
  redirectPath = "/sign-in",
  children,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isPublic && user) {
    return <Navigate to="/" replace />;
  }

  if (!isPublic && !user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
