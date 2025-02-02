import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoIconProps {
  url?: string;
  size?: number;
  fontSize?: number;
  className?: string;
}

const LogoIcon = ({
  url = "/",
  size = 40,
  fontSize = 24,
  className,
}: LogoIconProps) => {
  return (
    <Link
      to={url}
      style={{
        width: size,
        height: size,
      }}
      className={cn(
        "border-2 flex items-center justify-center rounded-lg bg-primary",
        className
      )}
    >
      <span
        style={{ fontSize: fontSize }}
        className="font-bold text-gray-50 dark:text-black"
      >
        S
      </span>
    </Link>
  );
};

export default LogoIcon;
