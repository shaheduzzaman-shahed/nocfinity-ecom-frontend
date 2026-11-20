"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActivityLog } from "../types/activity-log.types";

interface ActivityLogPayloadDialogProps {
  log: ActivityLog | null;
  onClose: () => void;
}

export function ActivityLogPayloadDialog({
  log,
  onClose,
}: ActivityLogPayloadDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!log) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [log, onClose]);

  if (!log) return null;

  const payloadString = log.payload
    ? JSON.stringify(log.payload, null, 2)
    : "No payload data recorded for this event.";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payloadString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Activity Log Details #{log.id}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Event slug: <code className="font-mono text-primary font-medium">{log.action}</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
            <div>
              <span className="text-muted-foreground block text-[11px]">User</span>
              <span className="font-medium text-foreground">
                {log.user ? `${log.user.name} (${log.user.account_type})` : "System / Anonymous"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">IP Address</span>
              <span className="font-mono text-foreground">{log.ip_address || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Target Entity</span>
              <span className="font-mono text-foreground">
                {log.entity_type ? `${log.entity_type.split("\\").pop()} #${log.entity_id ?? ""}` : "None"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Timestamp</span>
              <span className="text-foreground">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-foreground text-[11px] uppercase tracking-wider">
                Event Payload / State Snapshot
              </span>
              {log.payload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      Copy JSON
                    </>
                  )}
                </Button>
              )}
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto max-h-64 border border-zinc-800">
              {payloadString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3 bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
