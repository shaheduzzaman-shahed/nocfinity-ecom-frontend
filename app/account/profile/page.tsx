import type { Metadata } from "next";
import { ProfileForm } from "@/features/auth/components/profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
