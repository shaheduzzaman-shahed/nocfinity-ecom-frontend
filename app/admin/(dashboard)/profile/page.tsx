import type { Metadata } from "next";
import { AdminProfileForm } from "@/features/admin-auth/components/admin-profile-form";

export const metadata: Metadata = {
  title: "Admin Profile",
};

export default function AdminProfilePage() {
  return <AdminProfileForm />;
}
