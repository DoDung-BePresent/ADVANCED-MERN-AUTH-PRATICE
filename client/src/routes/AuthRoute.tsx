import useAuth from "@/hooks/use-auth";
import { LoaderCircleIcon } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const { data, isLoading } = useAuth();
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default AuthRoute;
