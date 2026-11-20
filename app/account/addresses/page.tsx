"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AddressCard } from "@/features/addresses/components/address-card";
import { AddressDialog } from "@/features/addresses/components/address-dialog";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/features/addresses/hooks/use-addresses";
import type {
  AddressPayload,
  ShippingAddress,
} from "@/features/addresses/types/address.types";
import { ApiError } from "@/lib/api/error";

export default function AccountAddressesPage() {
  const addressesQuery = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );
  const [addressToDelete, setAddressToDelete] =
    useState<ShippingAddress | null>(null);
  const [serverErrors, setServerErrors] = useState<
    Record<string, string[]> | undefined
  >();

  const addresses = addressesQuery.data ?? [];

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setServerErrors(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setServerErrors(undefined);
    setDialogOpen(true);
  };

  const handleSubmit = (payload: AddressPayload) => {
    setServerErrors(undefined);

    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress.id, data: payload },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingAddress(null);
          },
          onError: (error) => {
            if (error instanceof ApiError && error.isValidation) {
              setServerErrors(error.errors);
            }
          },
        }
      );
    } else {
      createAddress.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.isValidation) {
            setServerErrors(error.errors);
          }
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/account" className="hover:text-foreground">
          Account
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Addresses</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Shipping Addresses
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your saved delivery addresses for expedited checkout.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {/* Addresses Grid */}
      {addressesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center bg-card">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold">
            No saved addresses
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add a shipping address to save time during checkout.
          </p>
          <Button onClick={handleOpenCreate} size="sm" className="mt-5 gap-1.5">
            <Plus className="h-4 w-4" />
            Add First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleOpenEdit}
              onDelete={setAddressToDelete}
              onSetDefault={(addr) => setDefaultAddress.mutate(addr.id)}
              isSettingDefault={setDefaultAddress.isPending}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <AddressDialog
        open={dialogOpen}
        initialData={editingAddress}
        isSubmitting={createAddress.isPending || updateAddress.isPending}
        serverErrors={serverErrors}
        onClose={() => {
          setDialogOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={addressToDelete !== null}
        title="Delete Shipping Address"
        description={`Are you sure you want to remove "${addressToDelete?.name ?? "this address"}"? Addresses linked to existing orders cannot be deleted.`}
        confirmLabel="Delete Address"
        isPending={deleteAddress.isPending}
        onCancel={() => setAddressToDelete(null)}
        onConfirm={() => {
          if (!addressToDelete) return;
          deleteAddress.mutate(addressToDelete.id, {
            onSettled: () => setAddressToDelete(null),
          });
        }}
      />
    </div>
  );
}
