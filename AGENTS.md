# **Next.js Frontend Architecture & Best Practices**

For your fashion e-commerce platform, I recommend a **feature-based architecture using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui**.

The architecture should separate the storefront, customer account, and admin panel while sharing common components, utilities, and API services.

## **1. Recommended project structure**

```

fashion-ecommerce-frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   │
│   ├── app/
│   │   ├── (storefront)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── categories/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   └── checkout/page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── account/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── orders/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── coupons/
│   │   │   ├── staff/
│   │   │   ├── roles/
│   │   │   ├── permissions/
│   │   │   ├── settings/
│   │   │   │   ├── shipping/page.tsx
│   │   │   │   └── currency/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   ├── api/              # Only for Next.js-owned endpoints
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── common/           # Shared components
│   │   ├── storefront/
│   │   ├── account/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── coupons/
│   │   ├── checkout/
│   │   ├── payments/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── staff/
│   │   ├── roles/
│   │   ├── permissions/
│   │   └── settings/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── utils/
│   │   ├── validations/
│   │   └── constants/
│   │
│   ├── providers/
│   ├── stores/
│   ├── types/
│   └── middleware.ts
│
├── .env.local
├── components.json
├── next.config.ts
├── package.json
└── tsconfig.json

```

## **2. Feature module architecture**

Each business feature should own its API functions, components, hooks, schemas, and types.

For example, the product module:

```

features/
└── products/
    ├── api/
    │   ├── product.api.ts
    │   └── product.queries.ts
    │
    ├── components/
    │   ├── product-card.tsx
    │   ├── product-form.tsx
    │   ├── product-grid.tsx
    │   ├── product-gallery.tsx
    │   └── product-filters.tsx
    │
    ├── hooks/
    │   └── use-products.ts
    │
    ├── schemas/
    │   └── product.schema.ts
    │
    ├── types/
    │   └── product.types.ts
    │
    └── utils/
        └── product.utils.ts

```

Follow the same pattern for orders, categories, coupons, authentication, and other business modules.

**Why this approach?**

- Easy to maintain.
- Easy to find code.
- Features remain independent.
- Easier to test.
- Easier to expand as the project grows.
- Multiple developers can work on different modules.

## **3. Recommended technology and libraries**

| Purpose                 | Recommended technology         |
| ----------------------- | ------------------------------ |
| Framework               | Next.js 14+ App Router         |
| Language                | TypeScript                     |
| Styling                 | Tailwind CSS                   |
| UI components           | shadcn/ui                      |
| Icons                   | Lucide React                   |
| API requests            | Native fetch                   |
| Server-state management | TanStack Query                 |
| Form management         | React Hook Form                |
| Form validation         | Zod                            |
| Client-side state       | Zustand                        |
| Tables                  | TanStack Table                 |
| Notifications           | Sonner                         |
| Date formatting         | date-fns                       |
| Payments                | Stripe.js + React Stripe.js    |
| Testing                 | Vitest + React Testing Library |
| E2E testing             | Playwright                     |

Avoid installing multiple libraries that solve the same problem.

## **4. API integration architecture**

Your Laravel backend should remain the source of truth for business logic and data.

Create one centralized API client rather than writing fetch logic inside every component.

Recommended structure:

```

lib/
└── api/
    ├── client.ts
    ├── endpoints.ts
    ├── api-error.ts
    └── types.ts

features/
└── products/
    └── api/
        ├── product.api.ts
        └── product.queries.ts

```

Example API client:

```

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

```

This is a starting point. Add proper handling for Laravel Sanctum CSRF initialization, validation errors, non-JSON responses, and session expiration before using it in production.

## **5. State management strategy**

Do not put everything into Zustand or React Context.

Use each tool for its appropriate responsibility:

| Data                    | Recommended solution                |
| ----------------------- | ----------------------------------- |
| Product catalog         | TanStack Query / Server Components  |
| Product details         | Server Components or TanStack Query |
| Categories              | Server Components / TanStack Query  |
| Customer authentication | Secure session                      |
| Shopping cart           | Zustand + backend synchronization   |
| Checkout form           | React Hook Form                     |
| Product filters         | URL search parameters               |
| Admin tables            | TanStack Query + URL parameters     |
| UI modal/sidebar state  | Local React state                   |
| User permissions        | Auth/session data                   |

**Important:** The backend must validate cart prices, inventory, discounts, permissions, and order totals. Never trust frontend state for financial calculations.

## **6. Next.js rendering strategy**

Use Server Components by default. Introduce Client Components only when browser-side interactivity is necessary.

| Page                | Recommended rendering                           |
| ------------------- | ----------------------------------------------- |
| Homepage            | Server Component                                |
| Product listing     | Server Component + interactive filters          |
| Product details     | Server Component                                |
| Category pages      | Server Component                                |
| Login/register      | Client Component                                |
| Shopping cart       | Client Component                                |
| Checkout            | Client Component                                |
| Customer orders     | Server Component or TanStack Query              |
| Admin dashboard     | Server Component + interactive widgets          |
| Admin product forms | Client Component                                |
| Admin tables        | Server Component + interactive table components |

For public product pages, use appropriate caching and revalidation. For customer-specific and admin data, avoid shared caching that could expose one user's data to another.

## **7. Authentication architecture**

For your Laravel Sanctum implementation, I recommend cookie-based authentication using Sanctum's stateful SPA authentication when the frontend and backend are configured on compatible domains.

Authentication flow:

```

Customer opens website
        |
        v
Check authentication session
        |
        v
Not authenticated?
        |
        +---- Yes ----> Login page
        |                  |
        |                  v
        |             Laravel login
        |                  |
        |                  v
        |             Session cookie
        |                  |
        +------------------+
                  |
                  v
          Authenticated user
                  |
                  v
          Check customer access
                  |
                  v
          Customer account

```

For admin access:

- Check staff authentication.
- Verify staff role and permissions.
- Protect admin pages.
- Enforce all permissions again in Laravel APIs.

**Security recommendations**

- Do not store session identifiers or Sanctum bearer tokens in localStorage.
- Use secure, HttpOnly cookies for session-based authentication.
- Configure Sanctum CSRF cookie initialization.
- Configure CORS and trusted stateful domains correctly.
- Do not rely on Next.js middleware alone for authorization.
- Keep customer and staff authorization separate.

If your frontend and backend must operate on unrelated domains, plan the authentication architecture separately rather than assuming Sanctum's cookie-based SPA flow will work unchanged.

## **8. Layout architecture**

Keep three distinct layouts.

**Storefront layout**

- Header
- Navigation
- Search
- Footer
- Cart indicator

**Customer account layout**

- Account sidebar
- Profile navigation
- Order navigation
- Account content

**Admin layout**

- Admin sidebar
- Top navigation
- Breadcrumbs
- Dashboard content
- Notification area

Each layout should be implemented in its own route-group or route-level layout.

## **9. Form and validation standards**

Use React Hook Form + Zod for all complex forms.

Apply this to:

- Registration.
- Login.
- Product creation.
- Product editing.
- Category creation.
- Coupon creation.
- Shipping configuration.
- Currency configuration.
- Checkout.
- Customer profile.
- Staff management.

Best practices:

- Client-side validation for user experience.
- Server-side Laravel validation for security.
- Display field-level errors.
- Disable submit buttons during requests.
- Show success/error notifications.
- Prevent accidental duplicate submissions.

## **10. UI component standards**

Build reusable components instead of duplicating UI.

Suggested shared components:

**Common**

- PageHeader
- Breadcrumb
- ConfirmDialog
- DataTable
- Pagination
- SearchInput
- StatusBadge
- EmptyState
- LoadingState
- ErrorState
- ImageUploader

**Storefront**

- ProductCard
- ProductGrid
- ProductGallery
- PriceDisplay
- CategoryCard
- AddToCartButton

**Admin**

- AdminSidebar
- AdminHeader
- StatsCard
- FilterBar
- ProductForm
- OrderStatusSelector
- PermissionGuard

Keep shadcn/ui primitives in `components/ui` and business-specific components inside their feature folders.

## **11. Code quality and best practices**

Follow these rules throughout the project:

1. Use strict TypeScript. Avoid `any`.
2. Keep components small and focused.
3. Separate API logic from UI components.
4. Use reusable hooks for shared client-side logic.
5. Use Server Components by default.
6. Use Client Components only where needed.
7. Keep business logic out of page components.
8. Use Zod schemas for form validation.
9. Use TanStack Query for complex server-state synchronization.
10. Use URL parameters for search, sorting, filters, and pagination.
11. Use semantic HTML and accessible components.
12. Add loading, empty, and error states to every data-driven page.
13. Use `next/image` for optimized images.
14. Use `next/font` for fonts.
15. Keep environment variables out of source control.
16. Never expose private API secrets through `NEXT_PUBLIC_` variables.
17. Use consistent naming conventions.
18. Write tests for critical business flows.
19. Avoid unnecessary global state.
20. Do not duplicate backend business rules in the frontend.

## **12. Recommended implementation order**

Build your Next.js frontend in this order:

| Step | Frontend module                       |
| ---- | ------------------------------------- |
| 1    | Next.js project setup                 |
| 2    | Tailwind CSS + shadcn/ui              |
| 3    | Folder architecture                   |
| 4    | API client and error handling         |
| 5    | Shared UI components                  |
| 6    | Authentication and session management |
| 7    | Storefront layout                     |
| 8    | Homepage                              |
| 9    | Category pages                        |
| 10   | Product listing                       |
| 11   | Product details                       |
| 12   | Search, filters, sorting              |
| 13   | Shopping cart                         |
| 14   | Coupon interface                      |
| 15   | Shipping and currency display         |
| 16   | Checkout                              |
| 17   | Stripe payment                        |
| 18   | Order confirmation                    |
| 19   | Customer account                      |
| 20   | Customer order management             |
| 21   | Admin layout                          |
| 22   | Admin dashboard                       |
| 23   | Admin product management              |
| 24   | Admin category management             |
| 25   | Admin order management                |
| 26   | Admin customer management             |
| 27   | Coupon management                     |
| 28   | Staff and RBAC management             |
| 29   | Shipping and currency settings        |
| 30   | Testing and optimization              |

## **My recommended architecture decision**

## **Use this architecture**

**Architecture**

Recommended

Feature-based + App Router

**Rendering**

Server Components by default; Client Components for interaction.

**Data management**

TanStack Query + Server Components + Zustand where needed.

**Authentication**

Laravel Sanctum cookie-based SPA authentication, when domain configuration supports it.

**Forms**

React Hook Form + Zod.

**UI**

Tailwind CSS + shadcn/ui.

**One important recommendation:** Don't create one giant `components`, `hooks`, or `services` folder containing everything. Keep business-specific code inside `features`. This will make your e-commerce application significantly easier to maintain as the number of modules grows.
