import type { Voice } from "../data/deck";

export type SavedResponse = {
  id: string;
  cardId: string;
  voice: Voice;
  text: string;
  createdAt: string;
};

const KEY = "vt-seva.responses.v1";

function isSaved(value: unknown): value is SavedResponse {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SavedResponse>;
  return (
    typeof item.id === "string" &&
    typeof item.cardId === "string" &&
    (item.voice === "youth" || item.voice === "adult") &&
    typeof item.text === "string" &&
    typeof item.createdAt === "string" &&
    item.text.trim().length > 0 &&
    item.text.length <= 600
  );
}

export function loadResponses(): SavedResponse[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSaved);
  } catch {
    return [];
  }
}

export function saveResponses(items: SavedResponse[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
