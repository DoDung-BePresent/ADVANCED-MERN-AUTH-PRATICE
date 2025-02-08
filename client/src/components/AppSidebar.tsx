import {
  EllipsisIcon,
  Home,
  LogOut,
  MoonStarIcon,
  Settings,
  SunIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import LogoIcon from "./logo";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "@/lib/api";
import { useTheme } from "@/context/theme-provider";
import { useApiError } from "@/hooks/use-api-error";
import { toast } from "@/hooks/use-toast";

export const AppSidebar = () => {
  const { handleError } = useApiError();
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      navigate("/sign-in");
      toast({
        title: "Success",
        description: "Logout successfully!",
      });
    },
    onError: handleError,
  });

  const handleLogout = () => {
    mutate();
  };

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Setting",
      url: "/setting",
      icon: Settings,
    },
  ];
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoIcon fontSize={18} size={32} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="text-md">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarFallback className="rounded-full border border-gray-500">
                  {user?.name?.split(" ")?.[0]?.charAt(0).toUpperCase()}
                  {user?.name?.split(" ")?.[1]?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <EllipsisIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? <MoonStarIcon /> : <SunIcon />}
              Toggle theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isPending} onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
