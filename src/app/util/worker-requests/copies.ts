import { Copy, CopyStatus, Item, Page, PagedResponse } from "../types";

export async function getCopies(
  page: Page,
  expand?: string[],
): Promise<PagedResponse<Copy & { item: Item | null }>> {
  const params = new URLSearchParams({
    page_size: page.page_size.toString(),
    page_index: page.page_index.toString(),
  });

  if (expand) {
    params.set("expand", JSON.stringify(expand));
  }

  const res = await fetch(`/api/copies?${params}`);
  if (!res.ok) throw new Error("Failed to fetch copies");
  return res.json();
}

type CreateCopyPayload = {
  item_id: string;
  barcode: string;
  copy_label?: string;
  physical_location?: string;
  condition: string;
  status: CopyStatus;
  owner_club_id: string;
};
type ModifyCopyPayload = {
  id: string;
  item_id: string;
  barcode: string;
  copy_label?: string;
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
