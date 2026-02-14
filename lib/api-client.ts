// lib/api-client.ts
/**
 * Wrapper untuk fetch dengan error handling yang proper.
 * Mengatasi error "Unexpected token '<'" yang terjadi ketika
 * API return HTML error page (404/500) bukan JSON.
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "APIError";
  }
}

interface FetchOptions extends RequestInit {
  data?: any;
  params?: Record<string, string>;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { data, params, headers, ...fetchOptions } = options;

  // Build URL dengan query params
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers: finalHeaders,
  };

  // Add body untuk POST/PUT/PATCH
  if (data && ["POST", "PUT", "PATCH"].includes(finalOptions.method || "")) {
    finalOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, finalOptions);
    const contentType = response.headers.get("content-type");

    // Bukan JSON → throw (ini yang catch "Unexpected token '<'")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));

      throw new APIError(
        `Server returned non-JSON response (${response.status})`,
        response.status,
        { text: text.substring(0, 200) },
      );
    }

    // Parse JSON
    let json;
    try {
      json = await response.json();
    } catch {
      throw new APIError("Failed to parse server response", response.status);
    }

    // HTTP error
    if (!response.ok) {
      throw new APIError(
        json.error || json.message || "Request failed",
        response.status,
        json,
      );
    }

    return json;
  } catch (error) {
    if (error instanceof APIError) throw error;

    console.error("Network error:", error);
    throw new APIError("Network error - check your connection", 0);
  }
}

// ─── Shorthand methods ──────────────────────────────────────────
export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", data }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", data }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", data }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
