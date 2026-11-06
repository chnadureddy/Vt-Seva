import type { SavedResponse } from "./storage";

export type BoardPayload = {
  responses: SavedResponse[];
  featuredIds: string[];
};

export async function publishResponse(item: SavedResponse): Promise<void> {
  const response = await fetch("/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("save failed");
}

export async function deleteResponse(id: string): Promise<void> {
  const response = await fetch(`/api/responses/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 404) throw new Error("delete failed");
}

function adminHeaders(username: string, password: string) {
  return {
    "x-admin-user": username,
    "x-admin-password": password,
  };
}

export async function fetchAdminBoard(username: string, password: string): Promise<BoardPayload> {
  const response = await fetch("/api/admin/board", {
    headers: adminHeaders(username, password),
  });
  if (response.status === 401) throw new Error("unauthorized");
  if (!response.ok) throw new Error("load failed");
  return (await response.json()) as BoardPayload;
}

export async function publishFeatured(
  username: string,
  password: string,
  featuredIds: string[],
): Promise<void> {
  const response = await fetch("/api/admin/featured", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(username, password),
    },
    body: JSON.stringify({ featuredIds }),
  });
  if (response.status === 401) throw new Error("unauthorized");
  if (!response.ok) throw new Error("save failed");
}

export async function fetchPerspectives(): Promise<SavedResponse[]> {
  const response = await fetch("/api/perspectives");
  if (!response.ok) throw new Error("load failed");
  const data = (await response.json()) as { responses: SavedResponse[] };
  return data.responses;
}
