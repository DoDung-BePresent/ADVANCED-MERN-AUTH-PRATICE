import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export const Loading = ({ className }: { className?: string }) => (
  <LoaderCircleIcon className={cn("animate-spin", className)} />
);
