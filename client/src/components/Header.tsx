import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  return (
    <div className="w-full h-14 border-b fixed">
      <div className="flex items-center justify-start h-full mx-2">
        <SidebarTrigger />
      </div>
    </div>
  );
};

export default Header;
