"use client";

import { useEffect } from "react";
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
import {
  staffPasswordSchema,
  staffProfileSchema,
  type StaffPasswordFormValues,
  type StaffProfileFormValues,
} from "../schemas/admin-auth.schema";
import {
  useAdminProfile,
  useUpdateAdminPassword,
  useUpdateAdminProfile,
} from "../hooks/use-admin-auth";
import type { ApiError } from "@/lib/api/error";

export function AdminProfileForm() {
  const { data, isLoading } = useAdminProfile();
  const updateProfile = useUpdateAdminProfile();
  const updatePassword = useUpdateAdminPassword();

  const profileForm = useForm<StaffProfileFormValues>({
    resolver: zodResolver(staffProfileSchema),
    defaultValues: {
      name: "",
    },
  });

  const passwordForm = useForm<StaffPasswordFormValues>({
    resolver: zodResolver(staffPasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (data) {
      profileForm.reset({ name: data.user.name });
    }
  }, [data, profileForm]);

  const onProfileSubmit = (values: StaffProfileFormValues) => {
    updateProfile.mutate(values, {
      onError: (error: ApiError) => {
        if (error.isValidation && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            profileForm.setError(field as keyof StaffProfileFormValues, {
              message: messages[0],
            });
          });
        }
      },
    });
  };

  const onPasswordSubmit = (values: StaffPasswordFormValues) => {
    updatePassword.mutate(values, {
      onSuccess: () => {
        passwordForm.reset();
      },
      onError: (error: ApiError) => {
        if (error.isValidation && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            passwordForm.setError(field as keyof StaffPasswordFormValues, {
              message: messages[0],
            });
          });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your staff account details
        </p>
      </div>

      <form
        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your display name. Roles and permissions are managed by an
              administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data?.user.email ?? ""}
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Contact an administrator to change your email address.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save changes
        </Button>
      </form>

      <form
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Changing your password signs out your other active sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                placeholder="Enter current password"
                autoComplete="current-password"
                {...passwordForm.register("current_password")}
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.current_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                {...passwordForm.register("password_confirmation")}
              />
              {passwordForm.formState.errors.password_confirmation && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.password_confirmation.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updatePassword.isPending}>
          {updatePassword.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update password
        </Button>
      </form>
    </div>
  );
}
