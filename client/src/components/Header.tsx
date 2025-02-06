import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <div className="w-full z-10 bg-background h-14 border-b fixed">
      <div className="flex items-center justify-start h-full mx-2">
        <SidebarTrigger />
      </div>
    </div>
  );
};

