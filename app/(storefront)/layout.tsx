import { getCategoryTree } from "@/features/categories/api/categories.api";
import { StorefrontHeader } from "@/features/categories/components/storefront-header";

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

      <footer className="border-t bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-heading text-lg font-semibold text-foreground">
            Nocfinity
          </p>
          <p>
            &copy; {new Date().getFullYear()} Nocfinity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
