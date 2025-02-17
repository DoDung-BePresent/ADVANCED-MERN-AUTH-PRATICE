import { Navigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  isPublic?: boolean;
  redirectPath?: string;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  isAuthenticated,
  isLoading = false,
  isPublic = false,
  redirectPath = "/sign-in",
  children,
}: ProtectedRouteProps) => {
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isPublic && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isPublic && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
