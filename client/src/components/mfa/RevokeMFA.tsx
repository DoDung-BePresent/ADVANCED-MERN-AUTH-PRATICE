import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { revokeMFAMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useApiError } from "@/hooks/use-api-error";
import { Loading } from "../Loading";

const RevokeMFA = () => {
  const { handleError } = useApiError();
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
    onError: handleError,
  });
  return (
    <Button disabled={isPending} onClick={() => mutate()} variant="destructive">
      {isPending && <Loading />}
      Revoke MFA
    </Button>
  );
};

export default RevokeMFA;
