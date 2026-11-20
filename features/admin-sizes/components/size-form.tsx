"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sizeFormSchema,
  type SizeFormValues,
} from "../schemas/admin-size.schema";
import type { SizePayload } from "../types/admin-size.types";

interface SizeFormProps {
  defaultValues?: SizePayload;
  submitLabel: string;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (payload: SizePayload) => void;
}

const EMPTY_DEFAULTS: SizePayload = {
  name: "",
  sort_order: 0,
};

export function SizeForm({
  defaultValues = EMPTY_DEFAULTS,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
}: SizeFormProps) {
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      name: defaultValues.name,
      sort_order: String(defaultValues.sort_order),
    },
  });

  useEffect(() => {
    if (!serverErrors) return;

    const nameMessage = serverErrors.name?.[0];
    const sortOrderMessage = serverErrors.sort_order?.[0];

    if (nameMessage) {
      form.setError("name", { type: "server", message: nameMessage });
    }

    if (sortOrderMessage) {
      form.setError("sort_order", { type: "server", message: sortOrderMessage });
    }
  }, [serverErrors, form]);

  const submit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      sort_order: Number(values.sort_order),
    });
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Size details</CardTitle>
          <CardDescription>
            Sizes define the variant options available for each product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Size name</Label>
            <Input
              id="name"
              placeholder="e.g. M, XL, 42"
              {...form.register("name")}
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              type="number"
              min={0}
              inputMode="numeric"
              {...form.register("sort_order")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first, from smallest to largest.
            </p>
            {form.formState.errors.sort_order && (
              <p className="text-sm text-destructive">
                {form.formState.errors.sort_order.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/sizes" />}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
