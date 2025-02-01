import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "@/hooks/use-toast";
import { logoutMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      navigate("/sign-in");
      queryClient.clear();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  const handleLogout = useCallback(() => {
    mutate();
  }, [mutate]);
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="text-xl font-medium">Home Page</h1>
          <p>Hello {user?.name}</p>
        </div>
        <Button onClick={handleLogout} disabled={isPending} variant="outline">
          {isPending && <LoaderIcon className="animate-spin" />}
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Home;
