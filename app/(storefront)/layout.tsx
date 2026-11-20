import { getCategoryTree } from "@/features/categories/api/categories.api";
import { StorefrontHeader } from "@/features/categories/components/storefront-header";
import { StorefrontFooter } from "@/components/storefront-footer";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoryTree();

  return (
    <div className="flex min-h-svh flex-col">
      <StorefrontHeader categories={categories} />

      <main className="flex-1">{children}</main>

      <StorefrontFooter />
    </div>
  );
}
