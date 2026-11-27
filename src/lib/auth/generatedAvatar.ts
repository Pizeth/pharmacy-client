import { API_URL } from "@/types/constants";

export function getGeneratedAvatarUrl(userId: string): string {
  const url = new URL("/api/images/initials/svg", API_URL);
  url.searchParams.set("seed", userId);
  url.searchParams.set("chars", "2");
  return url.href;
}
