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
