"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { BoardGame } from "@/app/util/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateBoardGameForm } from "./create-board-game-form";
import { ModifyBoardGameForm } from "./modify-board-game-form";

type BoardGameRow = BoardGame & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// @todo use SSR for table data fetching
export default function BoardGamesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBoardGame, setSelectedBoardGame] =
    useState<BoardGameRow | null>(null);

  const fetchBoardGames = async (): Promise<GetManyResponse<BoardGameRow>> => {
    const res = await fetch("/api/board-games?page_size=100");
    if (!res.ok) throw new Error("Failed to fetch board games");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["board-games"],
    queryFn: fetchBoardGames,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load board games.</p>;

  return (
    <Page id="board-games-page" wide>
      <DataTable
        rows={data.data}
        columns={[
          { header: "Title", cell: (bg) => bg.title },
          { header: "Players", cell: (bg) => `${bg.minPlayers}–${bg.maxPlayers}` },
          { header: "Playtime (min)", cell: (bg) => bg.playTime },
          { header: "Difficulty", cell: (bg) => bg.difficulty },
          { header: "BGG ID", cell: (bg) => bg.bggId },
        ]}
        onRowClick={setSelectedBoardGame}
        title="Board Games"
        cta={
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(bg) => bg.id}
        getRowAriaLabel={(bg) => `Edit ${bg.title}`}
      />

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new board game"
      >
        <CreateBoardGameForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedBoardGame !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedBoardGame(null);
        }}
        title={`Edit ${selectedBoardGame?.title}`}
      >
        {selectedBoardGame ? (
          <ModifyBoardGameForm
            boardGame={selectedBoardGame}
            onSuccess={() => setSelectedBoardGame(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
