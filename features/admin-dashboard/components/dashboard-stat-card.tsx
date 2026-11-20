import { type LucideIcon } from "lucide-react";
import { cn } from "cn";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "warning" | "success";
  className?: string;
}

export function DashboardStatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeVariant = "default",
  className,
}: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </div>
        {badge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              badgeVariant === "warning" &&
                "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
              badgeVariant === "success" &&
                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
              badgeVariant === "default" &&
                "bg-muted text-muted-foreground"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] text-muted-foreground">{subtext}</p>
    </div>
  );
}
