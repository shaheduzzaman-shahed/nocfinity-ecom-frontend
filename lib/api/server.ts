const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch public API data from a Server Component. Storefront pages stay
 * renderable when the API is unavailable by returning null instead of
 * throwing.
 */
export async function serverGet<T>(endpoint: string): Promise<T | null> {
  if (!API_URL) return null;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}
