import { AppError } from "../errors/app-error";

export async function fetchJson<T>(request: Request | URL | string): Promise<T> {
  const response = await fetch(request);
  if (!response.ok) {
    throw new AppError("HTTP_ERROR", `HTTP ${response.status} for ${response.url}`);
  }
  return (await response.json()) as T;
}
