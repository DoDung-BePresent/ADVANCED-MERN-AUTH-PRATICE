import { useToast } from "./use-toast";

export const useApiError = () => {
  const { toast } = useToast();

  const handleError = (error: unknown) => {
    toast({
      title: "Error",
      description:
        (error as any)?.response?.data?.message || "Something went wrong!",
      variant: "destructive",
    });
  };

  return { handleError };
};
