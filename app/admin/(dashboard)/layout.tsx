"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Coins,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Palette,
  Ruler,
  ShieldCheck,
  Shirt,
  Star,
  Sun,
  TicketPercent,
  Truck,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "cn";
import { useAdminAuthStore } from "@/stores/admin-auth.store";
import {
  useAdminLogout,
  useAdminProfile,
} from "@/features/admin-auth/hooks/use-admin-auth";
import { hasAnyPermission } from "@/features/admin-rbac/lib/permissions";
import { ApiError } from "@/lib/api/error";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    permissions: ["dashboard.view", "reports.view"],
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: Package,
    permissions: ["orders.view"],
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
    permissions: ["customers.view"],
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Shirt,
    permissions: ["products.view"],
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: Star,
    permissions: ["reviews.view"],
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderTree,
    permissions: ["categories.view"],
  },
  {
    href: "/admin/colors",
    label: "Colors",
    icon: Palette,
    permissions: ["products.view"],
  },
  {
    href: "/admin/sizes",
    label: "Sizes",
    icon: Ruler,
    permissions: ["products.view"],
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: TicketPercent,
    permissions: ["coupons.view"],
  },
  {
    href: "/admin/settings/shipping",
    label: "Shipping",
    icon: Truck,
    permissions: ["shipping.view"],
  },
  {
    href: "/admin/settings/currency",
    label: "Currency",
    icon: Coins,
    permissions: ["currency.view"],
  },
  {
    href: "/admin/roles",
    label: "Roles",
    icon: ShieldCheck,
    permissions: ["roles.view"],
  },
  {
    href: "/admin/staff",
    label: "Staff",
    icon: UserCog,
    permissions: ["staff.manage"],
  },
  {
    href: "/admin/activity-logs",
    label: "Activity Logs",
    icon: Activity,
    permissions: ["activity_logs.view"],
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: User,
    permissions: [],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminLogout();
  const user = useAdminAuthStore((state) => state.user);
  const storedPermissions = useAdminAuthStore((state) => state.permissions);
  const clearAuth = useAdminAuthStore((state) => state.clearAuth);
  const profileQuery = useAdminProfile();

  const permissions = profileQuery.data?.permissions ?? storedPermissions;
  const permissionsLoading =
    profileQuery.isLoading && permissions.length === 0;
  const visibleNavItems = navItems.filter(
    (item) =>
      item.permissions.length === 0 ||
      hasAnyPermission(permissions, item.permissions)
  );

  useEffect(() => {
    const error = profileQuery.error;

    if (
      error instanceof ApiError &&
      (error.isUnauthorized || error.isForbidden)
    ) {
      clearAuth();
      router.replace("/admin/login");
    }
  }, [profileQuery.error, clearAuth, router]);

  const { resolvedTheme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-heading text-lg font-bold">Nocfinity Admin</span>
      </div>
      <nav className="space-y-1 p-4">
        {permissionsLoading ? (
          <div className="space-y-2 px-1">
            <div className="h-8 animate-pulse rounded-md bg-muted" />
            <div className="h-8 animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          visibleNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </nav>
    </>
  );

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r bg-sidebar transition-[width] duration-200 lg:block",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-1">
            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Desktop toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name ?? "\u2014"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
