import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";
import { mfaSetupQueryFn } from "@/lib/api";
import { pinMFASchema } from "@/validations/mfa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["mfa-setup"],
    queryFn: mfaSetupQueryFn,
    enabled: isOpen,
    staleTime: Infinity,
  });

  /**
   * Bạn đặt staleTime: Infinity, nghĩa là dữ liệu không bao giờ bị coi là stale (cũ).
   * Khi đóng modal (isOpen = false), dữ liệu của query vẫn được giữ lại trong cache.
   * Khi mở lại modal (isOpen = true), React Query thấy dữ liệu trong cache vẫn "fresh" nên không gọi lại API.
   */

  const form = useForm<z.infer<typeof pinMFASchema>>({
    resolver: zodResolver(pinMFASchema),
    defaultValues: {
      pin: "",
    },
  });

  const onCopy = useCallback(() => {
    setCopied(true);
  }, []);

  return (
    <div className="h-[calc(100vh-56px)] mt-14 mx-20 pt-10">
      <div className="max-w-screen-xl mx-auto bg-red-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Enable MFA</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setup Multi-Factor Authentication</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground">
              <h1 className="font-bold">Scan the QR code</h1>
              <p>
                Use an app like{" "}
                <span className="font-medium text-primary underline">
                  1Password
                </span>{" "}
                or{" "}
                <span className="font-medium text-primary underline">
                  Google Authenticator
                </span>{" "}
                to scan the QR code below.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="">
                {isLoading || !data?.qrCodeUrl ? (
                  <Skeleton className="w-40 h-40" />
                ) : (
                  <div className="rounded-md overflow-hidden border-2">
                    <img
                      src={data.qrCodeUrl}
                      alt="QR code"
                      className="w-40 h-40"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1 items-center justify-center flex flex-col">
                {/* <Skeleton className="w-52 h-4" />
                <Skeleton className="w-52 h-3" /> */}
                {showKey ? (
                  <div className="flex items-center gap-1">
                    <h1>Copy setup key</h1>
                    <button
                      className="hover:bg-muted rounded-md p-1"
                      onClick={onCopy}
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <h1>Can't see the code?</h1>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowKey(true)}
                    >
                      View the setup key!
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Then enter the code
                        </FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={0}
                                className="w-14 h-14 text-lg"
                              />
                              <InputOTPSlot
                                index={1}
                                className="w-14 h-14 text-lg"
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={2}
                                className="w-14 h-14 text-lg"
                              />
                              <InputOTPSlot
                                index={3}
                                className="w-14 h-14 text-lg"
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={4}
                                className="w-14 h-14 text-lg"
                              />
                              <InputOTPSlot
                                index={5}
                                className="w-14 h-14 text-lg"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button size="lg" className="w-full">
                    Verify
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
