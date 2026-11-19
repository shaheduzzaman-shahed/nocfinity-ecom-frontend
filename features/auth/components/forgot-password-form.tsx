"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/use-auth";
import type { ApiError } from "@/lib/api/error";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword.mutate(data, {
      onSuccess: () => setSubmitted(true),
      onError: (error: ApiError) => {
        if (error.isValidation && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof ForgotPasswordFormValues, {
              message: messages[0],
            });
          });
        }
      },
    });
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Check your email</CardTitle>
          <CardDescription>
            If an account exists with that email, we&apos;ve sent a password
            reset link. Please check your inbox.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-heading">Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {forgotPassword.error && !forgotPassword.error.isValidation && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {forgotPassword.error.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset link
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
