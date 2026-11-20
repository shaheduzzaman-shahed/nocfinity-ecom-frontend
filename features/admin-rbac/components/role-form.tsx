"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionMatrix } from "./permission-matrix";
import {
  roleDetailsSchema,
  type RoleDetailsFormValues,
} from "../schemas/admin-rbac.schema";
import type { AdminPermission, RolePayload } from "../types/admin-rbac.types";

interface RoleFormProps {
  permissions: AdminPermission[];
  defaultValues?: RolePayload;
  submitLabel: string;
  isSubmitting: boolean;
  isReadOnly?: boolean;
  onSubmit: (payload: RolePayload) => void;
}

const EMPTY_DEFAULTS: RolePayload = {
  display_name: "",
  description: null,
  permissions: [],
};

export function RoleForm({
  permissions,
  defaultValues = EMPTY_DEFAULTS,
  submitLabel,
  isSubmitting,
  isReadOnly = false,
  onSubmit,
}: RoleFormProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    defaultValues.permissions
  );

  const form = useForm<RoleDetailsFormValues>({
    resolver: zodResolver(roleDetailsSchema),
    defaultValues: {
      display_name: defaultValues.display_name,
      description: defaultValues.description ?? "",
    },
  });

  const submit = form.handleSubmit((values) => {
    onSubmit({
      display_name: values.display_name.trim(),
      description: values.description?.trim() || null,
      permissions: selectedPermissions,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role details</CardTitle>
          <CardDescription>
            The role name is shown to staff. A unique identifier is generated
            automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Role name</Label>
            <Input
              id="display_name"
              placeholder="e.g. Content Editor"
              {...form.register("display_name")}
              disabled={isReadOnly || isSubmitting}
            />
            {form.formState.errors.display_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.display_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="What is this role responsible for?"
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("description")}
              disabled={isReadOnly || isSubmitting}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            {selectedPermissions.length} of {permissions.length} permissions
            selected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionMatrix
            permissions={permissions}
            selected={selectedPermissions}
            onChange={setSelectedPermissions}
            disabled={isReadOnly || isSubmitting}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/roles" />}
        >
          {isReadOnly ? "Back to roles" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
