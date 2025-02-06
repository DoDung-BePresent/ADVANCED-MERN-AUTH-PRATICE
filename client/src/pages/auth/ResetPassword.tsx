import { z } from "zod";
import { useForm } from "react-hook-form";
import { Frown } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LogoIcon from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "@/hooks/use-toast";
import { resetPasswordMutationFn } from "@/lib/api";
import { resetPasswordSchema } from "@/validations/auth";
import { useApiError } from "@/hooks/use-api-error";
import { Loading } from "@/components/Loading";

const ResetPassword = () => {
  const { handleError } = useApiError();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get("code");
  const exp = Number(params.get("exp"));
  const now = Date.now();

  const isValid = code && exp && exp > now;

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordMutationFn,
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    if (!code) {
      navigate("/forgot-password?email=");
      return;
    }

    const data = {
      password: values.password,
      verificationCode: code,
    };

    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        navigate("/");
      },
      onError: handleError,
    });
  };
  return (
    <>
      {isValid ? (
        <div className="w-full max-w-md">
          <div className="mb-4">
            <LogoIcon className="mb-4" />
            <h1 className="mb-1 text-xl font-bold tracking-tight">
              Setup a new password
            </h1>
            <p className="">
              Your password must be different from your previous one.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        disabled={isPending}
                        type="password"
                        placeholder="••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="password"
                        placeholder="••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <Loading />}
                Reset password
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Frown size="48px" className="" />
          <h2 className="text-xl font-bold tracking-[-0.16px]">
            Invalid or expired reset link
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground">
            You can request a new password reset link
          </p>
          <Button asChild>
            <Link to="/forgot-password?email=">Go to forgot password</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
