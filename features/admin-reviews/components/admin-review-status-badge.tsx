import { cn } from "@/lib/utils";
import type { AdminReviewStatus } from "../types/admin-review.types";

const STATUS_CONFIG: Record<
  AdminReviewStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending Moderation",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
};

interface AdminReviewStatusBadgeProps {
  status: AdminReviewStatus;
  className?: string;
}

export function AdminReviewStatusBadge({
  status,
  className,
}: AdminReviewStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
