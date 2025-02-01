import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    // retry: 1,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export default useAuth;
