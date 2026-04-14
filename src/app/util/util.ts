import { CopyStatus, ItemType } from "./types";

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

type CreateCopyPayload = {
  item_id: string;
  copy_number: number;
  physical_identifier?: string;
  physical_location?: string;
  condition: string;
  status: CopyStatus;
  owner_club_id: string;
};

type ModifyCopyPayload = {
  id: string;
  item_id: string;
  copy_number: number;
  physical_identifier?: string;
  physical_location?: string;
  condition: string;
  status: CopyStatus;
  owner_club_id: string;
};

export async function sendCreateCopyRequest(payload: CreateCopyPayload) {
  const res = await fetch("/api/copies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create copy");
  return res.json();
}

export async function sendModifyCopyRequest(payload: ModifyCopyPayload) {
  const res = await fetch("/api/copies", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update copy");
  return res.json();
}

export async function sendDeleteCopyRequest(id: string) {
  const res = await fetch("/api/copies", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete copy");
  return res.json();
}
