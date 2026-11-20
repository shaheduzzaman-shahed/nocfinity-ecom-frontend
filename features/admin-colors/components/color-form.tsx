"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
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
  colorFormSchema,
  type ColorFormValues,
} from "../schemas/admin-color.schema";
import type { ColorPayload } from "../types/admin-color.types";

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

interface ColorFormProps {
  defaultValues?: ColorPayload;
  submitLabel: string;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (payload: ColorPayload) => void;
}

const EMPTY_DEFAULTS: ColorPayload = {
  name: "",
  hex_code: null,
};

export function ColorForm({
  defaultValues = EMPTY_DEFAULTS,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
}: ColorFormProps) {
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      name: defaultValues.name,
      hex_code: defaultValues.hex_code ?? "",
    },
  });

  const nameValue = useWatch({ control: form.control, name: "name" });
  const hexValue = useWatch({ control: form.control, name: "hex_code" });
  const validHex = HEX_PATTERN.test(hexValue ?? "");

  useEffect(() => {
    if (!serverErrors) return;

    const nameMessage = serverErrors.name?.[0];
    const hexMessage = serverErrors.hex_code?.[0];

    if (nameMessage) {
      form.setError("name", { type: "server", message: nameMessage });
    }

    if (hexMessage) {
      form.setError("hex_code", { type: "server", message: hexMessage });
    }
  }, [serverErrors, form]);

  const submit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      hex_code: values.hex_code ? values.hex_code.toUpperCase() : null,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color details</CardTitle>
          <CardDescription>
            Colors are used for product variants and storefront swatches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color name</Label>
            <Input
              id="name"
              placeholder="e.g. Navy Blue"
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
            <Label htmlFor="hex_code">Hex code</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Pick a color"
                value={validHex ? hexValue : "#000000"}
                onChange={(event) =>
                  form.setValue("hex_code", event.target.value.toUpperCase(), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={isSubmitting}
                className="h-9 w-14 cursor-pointer rounded-xl border border-input bg-transparent p-1"
              />
              <Input
                id="hex_code"
                placeholder="#1A2B3C"
                className="font-mono"
                {...form.register("hex_code")}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Optional. Storefront swatches use this value when set.
            </p>
            {form.formState.errors.hex_code && (
              <p className="text-sm text-destructive">
                {form.formState.errors.hex_code.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border p-4">
            <span
              aria-hidden
              className="size-10 shrink-0 rounded-full border bg-muted"
              style={validHex ? { backgroundColor: hexValue } : undefined}
            />
            <div>
              <p className="text-sm font-medium">
                {nameValue.trim() || "Color preview"}
              </p>
              <p className="text-xs text-muted-foreground">
                {validHex ? hexValue.toUpperCase() : "No hex code selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/colors" />}
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
