"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, ShieldAlert, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { ActivityLog } from "../types/activity-log.types";
import { ActivityLogPayloadDialog } from "./activity-log-payload-dialog";

interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading: boolean;
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getActionBadgeStyle(action: string): string {
  if (action.startsWith("orders.")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (action.includes("auth.")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (action.startsWith("products.") || action.startsWith("categories.")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  if (action.startsWith("roles.") || action.startsWith("staff.")) return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  if (action.startsWith("settings.")) return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
  if (action.startsWith("reviews.")) return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
}

export function ActivityLogTable({
  logs,
  isLoading,
  currentPage,
  lastPage,
  total,
  onPageChange,
}: ActivityLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
        <p className="text-xs text-muted-foreground">Loading activity logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <ShieldAlert className="mx-auto size-9 text-muted-foreground/50 mb-3" />
        <h4 className="text-sm font-semibold text-foreground">No activity records found</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          No activity logs match your current filter parameters. Try adjusting your query or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => {
                const date = new Date(log.created_at);
                const shortEntity = log.entity_type ? log.entity_type.split("\\").pop() : null;

                return (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                      <div className="font-medium text-foreground">{date.toLocaleDateString()}</div>
                      <div className="text-[11px] text-muted-foreground">{date.toLocaleTimeString()}</div>
                    </td>

                    {/* User */}
                    <td className="py-3 px-4">
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {log.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate max-w-[160px]">
                            <div className="font-medium text-foreground flex items-center gap-1.5">
                              <span className="truncate">{log.user.name}</span>
                              <span
                                className={cn(
                                  "text-[10px] px-1.5 py-0.2 rounded-full font-medium border uppercase tracking-wider",
                                  log.user.account_type === "staff"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                )}
                              >
                                {log.user.account_type}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">{log.user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <UserIcon className="size-3.5" />
                          <span>System / Anonymous</span>
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] border font-medium",
                          getActionBadgeStyle(log.action)
                        )}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {shortEntity ? (
                        <div className="font-mono text-[11px] text-foreground">
                          {shortEntity} {log.entity_id ? `#${log.entity_id}` : ""}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">—</span>
                      )}
                    </td>

                    {/* IP Address */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-muted-foreground">
                      {log.ip_address || "—"}
                    </td>

                    {/* Details button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="size-3.5" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{lastPage}</span> ({total} total records)
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-7 text-xs"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="h-7 text-xs"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Dialog */}
      <ActivityLogPayloadDialog
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}
