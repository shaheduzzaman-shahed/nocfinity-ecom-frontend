"use client";

import { useState } from "react";
import {
  Edit,
  Loader2,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { useAdminAuthStore } from "@/stores/admin-auth.store";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useDeleteStaff,
  useRoles,
  useStaff,
  useToggleStaffStatus,
} from "@/features/admin-rbac/hooks/use-admin-rbac";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { StaffFormDialog } from "@/features/admin-rbac/components/staff-form-dialog";
import type { AdminStaffMember } from "@/features/admin-rbac/types/admin-rbac.types";

export default function AdminStaffPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "staff.manage")) {
    return <NoAccess />;
  }

  return <StaffContent />;
}

function StaffContent() {
  const staffQuery = useStaff();
  const rolesQuery = useRoles();
  const deleteMutation = useDeleteStaff();
  const toggleStatusMutation = useToggleStaffStatus();
  const currentUserId = useAdminAuthStore((state) => state.user?.id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffMember | null>(null);

  const staff = staffQuery.data ?? [];
  const roles = rolesQuery.data ?? [];

  const hasError = staffQuery.isError || rolesQuery.isError;
  const isLoading = staffQuery.isLoading || rolesQuery.isLoading;

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: AdminStaffMember) => {
    setEditingStaff(member);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (member: AdminStaffMember) => {
    toggleStatusMutation.mutate({
      staffId: member.id,
      isActive: !member.is_active,
    });
  };

  const handleDelete = (member: AdminStaffMember) => {
    if (confirm(`Are you sure you want to delete staff account "${member.name}"?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="size-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Staff Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage administrative staff accounts, assign granular role permissions, and control dashboard access.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 h-9 text-xs self-start sm:self-auto">
          <Plus className="size-3.5" />
          Add Staff Member
        </Button>
      </div>

      {/* Error Notice */}
      {hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-xs text-destructive">
          <p className="font-semibold">Unable to load staff accounts.</p>
          <p className="mt-1 text-muted-foreground">
            {staffQuery.error instanceof Error
              ? staffQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 text-xs"
            onClick={() => {
              staffQuery.refetch();
              rolesQuery.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Skeleton Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && staff.length === 0 && (
        <div className="rounded-xl border p-12 text-center text-xs text-muted-foreground">
          No staff accounts found.
        </div>
      )}

      {/* Staff Accounts Cards */}
      {!isLoading && !hasError && staff.length > 0 && (
        <div className="space-y-3">
          {staff.map((member) => {
            const isSelf = member.id === currentUserId;
            const isSuperAdmin = member.roles.includes("super-admin");
            const isLocked = isSuperAdmin || isSelf;

            const initials = member.name
              ? member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "S";

            return (
              <div
                key={member.id}
                className={cn(
                  "rounded-xl border bg-card p-4 shadow-sm transition-colors",
                  !member.is_active && "opacity-75 bg-muted/20"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-xs",
                        isSuperAdmin
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {member.name}
                        </span>
                        {isSelf && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            You
                          </span>
                        )}
                        {isSuperAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Shield className="size-3" />
                            Super Admin
                          </span>
                        )}
                        {!member.is_active && (
                          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            Deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {member.email} {member.phone && `• ${member.phone}`}
                      </p>

                      {/* Role Badges */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {member.roles.length === 0 ? (
                          <span className="text-[11px] text-muted-foreground italic">
                            No roles assigned
                          </span>
                        ) : (
                          member.roles.map((r) => {
                            const matchedRole = roles.find((role) => role.name === r);
                            const displayName = matchedRole
                              ? matchedRole.display_name
                              : r === "super-admin"
                              ? "Super Admin"
                              : r;

                            return (
                              <span
                                key={r}
                                className="inline-flex items-center rounded-md border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground"
                              >
                                {displayName}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Edit Account */}
                    {(!isSuperAdmin || isSelf) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(member)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        title="Edit Staff Member"
                      >
                        <Edit className="size-3.5 mr-1" />
                        Edit
                      </Button>
                    )}

                    {/* Toggle Active Status */}
                    {!isLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={toggleStatusMutation.isPending}
                        onClick={() => handleToggleStatus(member)}
                        className={cn(
                          "h-8 px-2 text-xs",
                          member.is_active
                            ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        )}
                        title={member.is_active ? "Deactivate Account" : "Activate Account"}
                      >
                        {member.is_active ? (
                          <>
                            <UserX className="size-3.5 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="size-3.5 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    )}

                    {/* Delete Account */}
                    {!isLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(member)}
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Delete Account"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Staff Create / Edit Modal Dialog */}
      <StaffFormDialog
        open={isFormOpen}
        staff={editingStaff}
        currentUserId={currentUserId}
        onOpenChange={setIsFormOpen}
      />
    </div>
  );
}
