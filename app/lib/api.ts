const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};