"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/use-auth";
import type { ApiError } from "@/lib/api/error";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword.mutate(data, {
      onError: (error: ApiError) => {
        if (error.isValidation && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof ResetPasswordFormValues, {
              message: messages[0],
            });
          });
        }
      },
    });
  };

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired. Please request a
            new one.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
          >
            Request a new link
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-heading">Reset password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {resetPassword.error && !resetPassword.error.isValidation && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {resetPassword.error.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              {...form.register("email")}
              readOnly={!!email}
              className={email ? "bg-muted" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Confirm your password"
              {...form.register("password_confirmation")}
            />
            {form.formState.errors.password_confirmation && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
