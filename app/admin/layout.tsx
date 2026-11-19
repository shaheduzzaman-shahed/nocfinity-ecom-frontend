export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-heading text-lg font-bold">Nocfinity Admin</span>
        </div>
        <nav className="space-y-1 p-4">
          {/* Sidebar nav items will go here, gated by permissions */}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-6">
          {/* Admin top bar: mobile menu toggle, breadcrumbs, profile */}
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
