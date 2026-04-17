const developmentApiUrl = "http://127.0.0.1:8000";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL =
  configuredApiUrl && configuredApiUrl.length > 0
    ? configuredApiUrl.replace(/\/+$/, "")
    : process.env.NODE_ENV === "development"
      ? developmentApiUrl
      : "";

export function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Add it to your Vercel project environment variables."
    );
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
