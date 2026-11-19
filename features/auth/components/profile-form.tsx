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
import { Separator } from "@/components/ui/separator";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas/auth.schema";
import { useProfile, useUpdateProfile } from "../hooks/use-auth";
import type { ApiError } from "@/lib/api/error";

export function ProfileForm() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateProfileFormValues) => {
    const payload: Record<string, string> = {
      name: data.name,
      email: data.email,
    };

    if (data.phone) payload.phone = data.phone;
    if (data.current_password) payload.current_password = data.current_password;
    if (data.password) {
      payload.password = data.password;
      payload.password_confirmation = data.password_confirmation ?? "";
    }

    updateProfile.mutate(payload, {
      onSuccess: () => {
        form.setValue("current_password", "");
        form.setValue("password", "");
        form.setValue("password_confirmation", "");
      },
      onError: (error: ApiError) => {
        if (error.isValidation && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof UpdateProfileFormValues, {
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
          Manage your account settings
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name, email, and phone number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" {...form.register("phone")} />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Leave blank to keep your current password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                placeholder="Enter current password"
                {...form.register("current_password")}
              />
              {form.formState.errors.current_password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.current_password.message}
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm new password"
                {...form.register("password_confirmation")}
              />
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password_confirmation.message}
                </p>
              )}
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
    </div>
  );
}
