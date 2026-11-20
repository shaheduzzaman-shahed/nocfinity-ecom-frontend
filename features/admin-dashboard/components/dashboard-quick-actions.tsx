import Link from "next/link";
import {
  Compass,
  Package,
  PlusCircle,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const QUICK_LINKS = [
  {
    href: "/admin/orders",
    label: "Fulfill Orders",
    subtext: "Track & dispatch pending shipments",
    icon: Package,
  },
  {
    href: "/admin/products/new",
    label: "Add New Product",
    subtext: "Publish garments and inventory",
    icon: PlusCircle,
  },
  {
    href: "/admin/reviews",
    label: "Moderate Reviews",
    subtext: "Inspect customer feedback & ratings",
    icon: Star,
  },
  {
    href: "/admin/customers",
    label: "Customer Accounts",
    subtext: "View profiles & purchase activity",
    icon: Users,
  },
];

export function DashboardQuickActions() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="size-4 text-primary" />
        <h3 className="font-heading text-base font-bold text-foreground">
          Quick Operations
        </h3>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40 hover:border-primary/30 group"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {link.subtext}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
