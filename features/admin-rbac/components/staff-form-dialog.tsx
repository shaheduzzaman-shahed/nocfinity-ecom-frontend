"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Shield, UserCog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import { ApiError } from "@/lib/api/error";
import {
  useCreateStaff,
  useRoles,
  useUpdateStaff,
} from "../hooks/use-admin-rbac";
import type { AdminRole, AdminStaffMember } from "../types/admin-rbac.types";

interface StaffFormDialogProps {
  open: boolean;
  staff: AdminStaffMember | null;
  currentUserId?: number;
  onOpenChange: (open: boolean) => void;
}

export function StaffFormDialog({
  open,
  staff,
  currentUserId,
  onOpenChange,
}: StaffFormDialogProps) {
  const isEditing = Boolean(staff);
  const isSelf = Boolean(staff && staff.id === currentUserId);
  const isSuperAdmin = Boolean(staff && staff.roles.includes("super-admin"));

  const rolesQuery = useRoles();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (open) {
      if (staff) {
        setName(staff.name);
        setEmail(staff.email);
        setPhone(staff.phone || "");
        setPassword("");
        setIsActive(staff.is_active);
        setSelectedRoles(staff.roles);
      } else {
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setIsActive(true);
        setSelectedRoles([]);
      }
      setValidationError(null);
      setFieldErrors({});
    }
  }, [open, staff]);

  if (!open) return null;

  const roles = (rolesQuery.data ?? []).filter((r) => !r.is_system);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setValidationError(null);
  };

  const toggleRole = (roleName: string) => {
    if (isSuperAdmin || isSelf) return;

    clearFieldError("roles");
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleMutationError = (err: unknown) => {
    if (err instanceof ApiError) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setValidationError(err.message);
      }
    } else if (err instanceof Error) {
      setValidationError(err.message);
    } else {
      setValidationError("An unexpected error occurred.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setFieldErrors({});

    if (!name.trim()) {
      setValidationError("Staff name is required.");
      return;
    }

    if (!email.trim()) {
      setValidationError("Valid email address is required.");
      return;
    }

    if (!isEditing && (!password || password.length < 8)) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (isEditing && staff) {
      updateMutation.mutate(
        {
          staffId: staff.id,
          payload: {
            name,
            email,
            phone: phone.trim() || null,
            ...(password ? { password } : {}),
            ...(!isSelf && !isSuperAdmin ? { is_active: isActive } : {}),
            ...(!isSelf && !isSuperAdmin ? { roles: selectedRoles } : {}),
          },
        },
        {
          onSuccess: () => onOpenChange(false),
          onError: handleMutationError,
        }
      );
    } else {
      createMutation.mutate(
        {
          name,
          email,
          phone: phone.trim() || null,
          password,
          is_active: isActive,
          roles: selectedRoles,
        },
        {
          onSuccess: () => onOpenChange(false),
          onError: handleMutationError,
        }
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
      role="presentation"
      onClick={() => {
        if (!isPending) onOpenChange(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCog className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? "Update account details and role assignments."
                  : "Create administrative credentials and assign permission roles."}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Global Error Notice */}
        {validationError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-xs">
              Full Name
            </Label>
            <Input
              id="staff-name"
              placeholder="e.g. Marcus Vance"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              className={cn("h-9 text-xs", fieldErrors.name && "border-destructive")}
              required
            />
            {fieldErrors.name?.[0] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {fieldErrors.name[0]}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-email" className="text-xs">
              Email Address
            </Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="staff@nocfinity.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={cn("h-9 text-xs", fieldErrors.email && "border-destructive")}
              required
            />
            {fieldErrors.email?.[0] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-phone" className="text-xs">
              Phone Number <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="staff-phone"
              type="tel"
              placeholder="+1 555-019-2834"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              className={cn("h-9 text-xs", fieldErrors.phone && "border-destructive")}
            />
            {fieldErrors.phone?.[0] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {fieldErrors.phone[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-password" className="text-xs">
              {isEditing ? "New Password (leave blank to keep current)" : "Password"}
            </Label>
            <Input
              id="staff-password"
              type="password"
              placeholder={isEditing ? "••••••••" : "Minimum 8 characters"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              className={cn("h-9 text-xs", fieldErrors.password && "border-destructive")}
              required={!isEditing}
            />
            {fieldErrors.password?.[0] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <Label className="text-xs font-semibold cursor-pointer">
                Account Active
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Deactivated accounts cannot sign in to the management panel.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSelf || isSuperAdmin}
              className="size-4 rounded border-input accent-primary cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* Role Assignments */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Assigned Roles</Label>
              {isSuperAdmin && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <Shield className="size-3" />
                  Super Admin (Protected)
                </span>
              )}
            </div>

            {fieldErrors.roles?.[0] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {fieldErrors.roles[0]}
              </p>
            )}

            {isSuperAdmin ? (
              <p className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                The Super Admin account has all permissions and cannot have its roles modified.
              </p>
            ) : isSelf ? (
              <p className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                You cannot modify your own role assignments.
              </p>
            ) : roles.length === 0 ? (
              <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                No custom roles created yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => {
                  const isChecked = selectedRoles.includes(role.name);
                  return (
                    <label
                      key={role.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs transition-colors",
                        isChecked
                          ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRole(role.name)}
                        className="size-3.5 rounded border-input accent-primary"
                      />
                      <span className="truncate">{role.display_name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 text-xs"
            >
              {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
