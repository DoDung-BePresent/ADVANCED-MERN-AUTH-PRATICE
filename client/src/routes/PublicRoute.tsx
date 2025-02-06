import { Loading } from "@/components/Loading";
import useAuth from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { data, isLoading } = useAuth();
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading className="h-10 w-10" />
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
