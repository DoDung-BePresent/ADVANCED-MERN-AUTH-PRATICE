import { z } from "zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Frown, LoaderCircleIcon } from "lucide-react";
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

const ResetPassword = () => {
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
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Something went wrong!",
          variant: "destructive",
        });
      },
    });
  };
  return (
    <>
      {isValid ? (
        <div className="max-w-md w-full">
          <div className="mb-4">
            <LogoIcon className="mb-4" />
            <h1 className="font-bold text-xl tracking-tight mb-1">
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
                {isPending && <LoaderCircleIcon className="animate-spin" />}
                Reset password
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <Frown size="48px" className="" />
          <h2 className="text-xl tracking-[-0.16px] font-bold">
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
