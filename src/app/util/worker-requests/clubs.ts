import { Club, Page } from "../types";

export async function getClubs(
  page: Page,
  filters?: Partial<{ ids: string[] }>,
): Promise<Club[]> {
  const params = new URLSearchParams({
    page_size: page.page_size.toString(),
    page_index: page.page_index.toString(),
  });

  if (filters) {
    params.set("filters", JSON.stringify(filters));
  }

  const res = await fetch(`/api/clubs?${params}`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  const json = await res.json();
  return json.data as Club[];
}

type CreateClubPayload = {
  name: string;
};

type ModifyClubPayload = {
  id: string;
  name: string;
};

export async function sendCreateClubRequest(payload: CreateClubPayload) {
  const res = await fetch("/api/clubs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create club");
  return res.json();
}

export async function sendModifyClubRequest(payload: ModifyClubPayload) {
  const res = await fetch("/api/clubs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update club");
  return res.json();
}

export async function sendDeleteClubRequest(id: string) {
  const res = await fetch("/api/clubs", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete club");
  return res.json();
}
