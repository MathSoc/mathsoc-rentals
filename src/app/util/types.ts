export type Page = {
  page_size: number;
  page_index: number;
};

export type PagedResponse<T> = {
  data: T[];
  meta: {
    total_count: number;
    page_index: number;
    page_size: number;
  };
};

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
  barcode: string;
  copyLabel: string | null;
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
  email: string;
};

export type BoardGame = {
  id: string;
  title: string;
  minPlayers: number | null;
  maxPlayers: number | null;
  playTime: number | null;
  bggId: string | null;
  difficulty: string | null;
};

export type Rental = {
  id: string;
  copyId: string;
  renterId: string;
  rentingClubId: string | null;
  checkoutDate: string;
  dueDate: string;
  dateReturned: string | null;
  cancelledAt: string | null;
};
