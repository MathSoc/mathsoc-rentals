export type ItemType = "board_game" | "calculator" | "textbook";

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  boardGameId: string | null;
};

export type CopyStatus =
  | "available"
  | "rented"
  | "missing"
  | "maintenance"
  | "retired";

export type Copy = {
  id: string;
  itemId: string;
  copyNumber: number;
  physicalIdentifier: string | null;
  physicalLocation: string | null;
  condition: string;
  status: CopyStatus;
  ownerClubId: string;
};

export type Club = {
  id: string;
  name: string;
};

export type Renter = {
  id: string;
  name: string;
  questId: string;
};
