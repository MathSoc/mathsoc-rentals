export type ItemType = "board_game" | "calculator" | "textbook";

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  boardGameId: string | null;
};
