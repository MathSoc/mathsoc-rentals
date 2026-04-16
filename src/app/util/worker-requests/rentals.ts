import { BoardGame, Club, Copy, Item, Page, Rental, Renter } from "../types";

export type ExpandedRental = Rental & {
  renter: Renter | null;
  item: Item | null;
  copy: Copy | null;
  board_game: BoardGame | null;
  club: Club | null;
};

export async function getRentals(
  page: Page,
  expand?: string[],
): Promise<ExpandedRental[]> {
  const params = new URLSearchParams({
    page_size: page.page_size.toString(),
    page_index: page.page_index.toString(),
  });

  if (expand) {
    params.set("expand", JSON.stringify(expand));
  }

  const res = await fetch(`/api/rentals?${params}`);
  if (!res.ok) throw new Error("Failed to fetch rentals");
  const json = await res.json();
  return json.data as ExpandedRental[];
}

type CreateRentalPayload = {
  copy_id: string;
  renter_id: string;
  renting_club_id?: string;
  checkout_date?: string;
  due_date: string;
};

type ModifyRentalPayload = {
  id: string;
  copy_id: string;
  renter_id: string;
  renting_club_id?: string;
  checkout_date?: string;
  due_date: string;
  date_returned?: string;
  cancelled_at?: string;
};

export async function sendCreateRentalRequest(payload: CreateRentalPayload) {
  const res = await fetch("/api/rentals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create rental");
  return res.json();
}

export async function sendModifyRentalRequest(payload: ModifyRentalPayload) {
  const res = await fetch("/api/rentals", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update rental");
  return res.json();
}

export async function sendDeleteRentalRequest(id: string) {
  const res = await fetch("/api/rentals", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete rental");
  return res.json();
}
