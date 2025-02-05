import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { revokeMFAMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";

const RevokeMFA = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: revokeMFAMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast({
        title: "Success",
        description: "MFA revoke successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    },
  });
  return (
    <Button disabled={isPending} onClick={() => mutate()} variant="destructive">
      {isPending && <LoaderIcon className="animate-spin" />}
      Revoke MFA
    </Button>
  );
};

export default RevokeMFA;
