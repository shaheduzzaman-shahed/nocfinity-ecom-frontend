"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, User, X } from "lucide-react";
import type { StorefrontCategory } from "../types/category.types";

function categoryHref(slug: string): string {
  return `/categories/${slug}`;
}

export function StorefrontHeader({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileOpen = openPath === pathname;

  function toggleMobileNavigation() {
    setOpenPath(mobileOpen ? null : pathname);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMobileNavigation}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight"
          >
            Nocfinity
          </Link>
        </div>

        <nav
          className="hidden items-center gap-7 text-sm md:flex"
          aria-label="Categories"
        >
          <Link
            href="/categories"
            className="py-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop all
          </Link>
          {categories.map((category) => {
            const children = category.children ?? [];

            return (
              <div key={category.id} className="group relative">
                <Link
                  href={categoryHref(category.slug)}
                  className="inline-flex items-center gap-1 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                  {children.length > 0 && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </Link>

                {children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-2xl border bg-popover p-2 shadow-lg">
                      <Link
                        href={categoryHref(category.slug)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        Shop all {category.name}
                      </Link>
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={categoryHref(child.slug)}
                          className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Link
          href="/account"
          aria-label="Account"
          className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t md:hidden">
          <nav
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
            aria-label="Mobile categories"
          >
            <Link
              href="/categories"
              className="block py-2 text-sm font-medium"
              onClick={() => setOpenPath(null)}
            >
              Shop all
            </Link>
            {categories.map((category) => {
              const children = category.children ?? [];

              return (
                <div key={category.id} className="mt-4">
                  <Link
                    href={categoryHref(category.slug)}
                    className="font-heading text-base font-semibold"
                    onClick={() => setOpenPath(null)}
                  >
                    {category.name}
                  </Link>
                  {children.length > 0 && (
                    <ul className="mt-2 space-y-1 border-l pl-4">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={categoryHref(child.slug)}
                            className="block py-1 text-sm text-muted-foreground"
                            onClick={() => setOpenPath(null)}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
