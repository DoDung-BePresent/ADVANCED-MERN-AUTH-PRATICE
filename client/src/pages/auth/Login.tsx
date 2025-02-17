import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
import { signInSchema } from "@/validations/auth";
import { useApiError } from "@/hooks/use-api-error";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/lib/auth-service";

const Login = () => {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useApiError();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    login(values, {
      onSuccess: () => {
        navigate("/");
        toast({
          title: "Success",
          description: "Logged in successfully!",
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
                    autoFocus
                    disabled={isLoginPending}
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
                    disabled={isLoginPending}
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
            <Link
              to={`/forgot-password?email=${form.getValues().email}`}
              className="text-sm font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Button disabled={isLoginPending} type="submit" className="w-full">
            {isLoginPending && <Loading />}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
