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
        "border-2 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-primary to-90%",
        className
      )}
    >
      <span style={{ fontSize: fontSize }} className="font-bold text-gray-50">
        S
      </span>
    </Link>
  );
};

export default LogoIcon;
