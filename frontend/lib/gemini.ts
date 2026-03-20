export const defaultGeminiModel =
  process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-1.5-pro";

export function buildGeminiHeaders() {
  return {
    "x-gemini-model": defaultGeminiModel
  };
}
