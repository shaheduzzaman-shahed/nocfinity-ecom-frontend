import { redirect } from "next/navigation";

export default function CurrencyRedirectPage() {
  redirect("/admin/settings/currency");
}
