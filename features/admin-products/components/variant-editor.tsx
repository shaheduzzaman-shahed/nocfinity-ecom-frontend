"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminColor } from "@/features/admin-colors/types/admin-color.types";
import type { AdminSize } from "@/features/admin-sizes/types/admin-size.types";
import type { ProductFormValues } from "../schemas/admin-product.schema";

interface VariantEditorProps {
  colors: AdminColor[];
  sizes: AdminSize[];
  disabled: boolean;
}

const EMPTY_VARIANT = {
  variant_id: "",
  color_id: "",
  size_id: "",
  sku: "",
  stock: "0",
  price_override: "",
  is_active: true,
};

export function VariantEditor({
  colors,
  sizes,
  disabled,
}: VariantEditorProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Variants</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each color and size combination is a separate SKU with its own
            stock and optional price override.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(EMPTY_VARIANT)}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add variant
        </Button>
      </div>

      {(colors.length === 0 || sizes.length === 0) && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          Add at least one color and one size before building variants.
        </p>
      )}

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="font-medium">No variants yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a variant for every purchasable color and size combination.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append(EMPTY_VARIANT)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
            Add first variant
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-medium">Color</th>
                <th className="px-3 py-3 font-medium">Size</th>
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 font-medium">Stock</th>
                <th className="px-3 py-3 font-medium">Price override</th>
                <th className="px-3 py-3 font-medium">Active</th>
                <th className="px-3 py-3 text-right font-medium">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fields.map((field, index) => {
                const rowErrors = errors.variants?.[index];

                return (
                  <tr key={field.id} className="align-top">
                    <td className="px-3 py-3">
                      <input
                        type="hidden"
                        {...register(`variants.${index}.variant_id`)}
                      />
                      <select
                        className="h-9 w-full rounded-2xl border border-transparent bg-input/50 px-2 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                        {...register(`variants.${index}.color_id`)}
                        disabled={disabled}
                      >
                        <option value="">Select color</option>
                        {colors.map((color) => (
                          <option key={color.id} value={String(color.id)}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                      {rowErrors?.color_id && (
                        <p className="mt-1 text-xs text-destructive">
                          {rowErrors.color_id.message}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <select
                        className="h-9 w-full rounded-2xl border border-transparent bg-input/50 px-2 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                        {...register(`variants.${index}.size_id`)}
                        disabled={disabled}
                      >
                        <option value="">Select size</option>
                        {sizes.map((size) => (
                          <option key={size.id} value={String(size.id)}>
                            {size.name}
                          </option>
                        ))}
                      </select>
                      {rowErrors?.size_id && (
                        <p className="mt-1 text-xs text-destructive">
                          {rowErrors.size_id.message}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <Input
                        className="h-9 min-w-40"
                        placeholder="SKU-001"
                        {...register(`variants.${index}.sku`)}
                        disabled={disabled}
                      />
                      {rowErrors?.sku && (
                        <p className="mt-1 text-xs text-destructive">
                          {rowErrors.sku.message}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <Input
                        className="h-9 w-24"
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        {...register(`variants.${index}.stock`)}
                        disabled={disabled}
                      />
                      {rowErrors?.stock && (
                        <p className="mt-1 text-xs text-destructive">
                          {rowErrors.stock.message}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <Input
                        className="h-9 w-32"
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="Optional"
                        {...register(`variants.${index}.price_override`)}
                        disabled={disabled}
                      />
                      {rowErrors?.price_override && (
                        <p className="mt-1 text-xs text-destructive">
                          {rowErrors.price_override.message}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <Label
                        htmlFor={`variant-active-${index}`}
                        className="sr-only"
                      >
                        Active
                      </Label>
                      <input
                        id={`variant-active-${index}`}
                        type="checkbox"
                        className="mt-2 size-4 accent-primary"
                        {...register(`variants.${index}.is_active`)}
                        disabled={disabled}
                      />
                    </td>

                    <td className="px-3 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove variant ${index + 1}`}
                        onClick={() => remove(index)}
                        disabled={disabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
