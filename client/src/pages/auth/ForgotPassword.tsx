import { z } from "zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
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
import { forgotPasswordMutationFn } from "@/lib/api";
import { forgotPasswordSchema } from "@/validations/auth";
import { useApiError } from "@/hooks/use-api-error";
import { Loading } from "@/components/Loading";

const ForgotPassword = () => {
  const { handleError } = useApiError();
  const [param] = useSearchParams();
  const email = param.get("email");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPasswordMutationFn,
  });

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Please check your email!",
        });
      },
      onError: handleError,
    });
  };
  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <LogoIcon className="mb-4" />
        <h1 className="mb-1 text-xl font-bold tracking-tight">
          Reset password
        </h1>
        <p className="text-muted-foreground">
          Include the email address associated with your account and we’ll send
          you an email with instructions to reset your password.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    disabled={isPending}
                    type="email"
                    placeholder="demo123@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <Loading />}
            Send reset email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
