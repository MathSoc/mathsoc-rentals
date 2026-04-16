import { BoardGame, Item, ItemType, Page } from "../types";

export async function getItems(
  page: Page,
  expand?: string[],
): Promise<(Item & { board_game?: BoardGame })[]> {
  const params = new URLSearchParams({
    page_size: page.page_size.toString(),
    page_index: page.page_index.toString(),
  });

  if (expand) {
    params.set("expand", JSON.stringify(expand));
  }

  const res = await fetch(`/api/items?${params}`);
  if (!res.ok) throw new Error("Failed to fetch items");
  const json = await res.json();
  return json.data as (Item & { board_game?: BoardGame })[];
}

export async function searchItems(q: string): Promise<Item[]> {
  const params = new URLSearchParams({ q, page_size: "20" });
  const res = await fetch(`/api/items?${params}`);
  if (!res.ok) throw new Error("Failed to search items");
  const json = await res.json();
  return json.data as Item[];
}

type CreateItemPayload = {
  name: string;
  type: ItemType;
  board_game_id?: string | null;
};
type ModifyItemPayload = {
  id: string;
  name: string;
  board_game_id?: string | null;
};

export async function sendCreateItemRequest(payload: CreateItemPayload) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function sendModifyItemRequest(payload: ModifyItemPayload) {
  const res = await fetch("/api/items", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function sendDeleteItemRequest(id: string) {
  const res = await fetch("/api/items", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}
