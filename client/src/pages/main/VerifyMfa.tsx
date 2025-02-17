import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LogoIcon from "@/components/logo";
import { Button } from "@/components/ui/button";

import { toast } from "@/hooks/use-toast";
import { verifyMFALoginMutationFn } from "@/lib/api";
import { pinMFASchema } from "@/validations/mfa";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useApiError } from "@/hooks/use-api-error";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/lib/auth-service";

const VerifyMfa = () => {
  const navigate = useNavigate();
  const { verifyMFA, isVerifyMFAPending } = useAuth();
  const { handleError } = useApiError();
  const [params] = useSearchParams();
  const email = params.get("email");

  const form = useForm<z.infer<typeof pinMFASchema>>({
    resolver: zodResolver(pinMFASchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = (values: z.infer<typeof pinMFASchema>) => {
    if (!email) {
      navigate("/");
      return;
    }

    const data = {
      code: values.pin,
      email,
    };

    verifyMFA(data, {
      onSuccess: () => {
        navigate("/");
        toast({
          title: "Success",
          description: "Login successfully!",
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
          Multi-Factor Authentication
        </h1>
        <p className="text-muted-foreground">
          Enter the code from your authenticator app.
        </p>
      </div>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Then enter the code</FormLabel>
                  <FormControl>
                    <InputOTP
                      disabled={isVerifyMFAPending}
                      maxLength={6}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={1} className="h-14 w-14 text-lg" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={3} className="h-14 w-14 text-lg" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={5} className="h-14 w-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size="lg" className="w-full">
              {isVerifyMFAPending && <Loading />}
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyMfa;
