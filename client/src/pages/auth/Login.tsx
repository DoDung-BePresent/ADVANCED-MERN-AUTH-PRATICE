import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircleIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/components/logo";

import { toast } from "@/hooks/use-toast";
import { SignInSchema } from "@/validations/auth";
import { loginMutationFn } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    mutate(values, {
      onSuccess: () => {
        navigate("/");
        toast({
          title: "Success",
          description: "Login successfully!",
        });
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
    <div className="max-w-md w-full">
      <div className="mb-4">
        <LogoIcon className="mb-4" />
        <h1 className="font-bold text-xl tracking-tight mb-1">
          Login to Squeezy
        </h1>
        <p>
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary underline underline-offset-2"
          >
            Sign up
          </Link>
          .
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
          <div className="text-right">
            <Link to="#" className="hover:underline text-sm font-medium">
              Forgot your password?
            </Link>
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <LoaderCircleIcon className="animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
