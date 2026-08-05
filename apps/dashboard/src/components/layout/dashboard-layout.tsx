import { SidebarProvider, SidebarInset, SidebarTrigger } from "@transora/ui/components/sidebar";
import { TooltipProvider } from "@transora/ui/components/tooltip";
import { Link, useLocation } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { Avatar, AvatarFallback } from "@transora/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@transora/ui/components/dropdown-menu";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { useLogout } from "@/features/auth/api/auth-mutations";
import { getInitials } from "@transora/shared";
import { Settings, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const initials = getInitials(user?.companyName || user?.email);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-y-auto">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4 sticky top-0 bg-sidebar text-sidebar-foreground z-10">
            <div className="flex items-center gap-1.5 text-xs">
              <SidebarTrigger className="-ml-1" />
              <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  const isFirst = index === 0;
                  const isLast = index === pathSegments.length - 1;
                  const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <div key={href} className="flex items-center gap-1.5">
                      {!isFirst && <span className="text-muted-foreground/60">/</span>}
                      {isLast ? (
                        <span className="font-medium text-foreground">{label}</span>
                      ) : (
                        <Link to={href} className="hover:text-foreground transition-colors">
                          {label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-0.5 hover:bg-muted/50 transition-colors focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2.5 text-xs">
                    <p className="font-semibold text-foreground truncate">{user?.companyName || "Account"}</p>
                    <p className="text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
