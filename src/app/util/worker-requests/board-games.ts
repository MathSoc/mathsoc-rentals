import { BoardGame, Page } from "@/app/util/types";

type CreateBoardGamePayload = {
  title: string;
  min_players: number;
  max_players: number;
  playtime: number;
  bgg_id?: string;
  difficulty?: string;
};

type ModifyBoardGamePayload = {
  id: string;
  title: string;
  min_players: number;
  max_players: number;
  playtime: number;
  bgg_id?: string;
  difficulty?: string;
};

export async function getBoardGames(
  page: Page,
  filters?: Partial<{ ids: string[] }>,
): Promise<BoardGame[]> {
  const params = new URLSearchParams({
    page_size: page.page_size.toString(),
    page_index: page.page_index.toString(),
  });

  if (filters) {
    params.set("filters", JSON.stringify(filters));
  }

  const res = await fetch(`/api/board-games?${params}`);
  if (!res.ok) throw new Error("Failed to search board games");
  const json = await res.json();
  return json.data as BoardGame[];
}

export async function searchBoardGames(q: string): Promise<BoardGame[]> {
  const params = new URLSearchParams({ q, page_size: "20" });
  const res = await fetch(`/api/board-games?${params}`);
  if (!res.ok) throw new Error("Failed to search board games");
  const json = await res.json();
  return json.data as BoardGame[];
}

export async function sendCreateBoardGameRequest(
  payload: CreateBoardGamePayload,
) {
  const res = await fetch("/api/board-games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create board game");
  return res.json();
}

export async function sendModifyBoardGameRequest(
  payload: ModifyBoardGamePayload,
) {
  const res = await fetch("/api/board-games", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update board game");
  return res.json();
}

export async function sendDeleteBoardGameRequest(id: string) {
  const res = await fetch("/api/board-games", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete board game");
  return res.json();
}
