"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { BoardGame } from "@/app/util/types";
import { getBoardGames } from "@/app/util/worker-requests/board-games";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateBoardGameForm } from "./create-board-game-form";
import { ModifyBoardGameForm } from "./modify-board-game-form";

// @todo use SSR for table data fetching
export default function BoardGamesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBoardGame, setSelectedBoardGame] = useState<BoardGame | null>(
    null,
  );
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 25;
  const { data, isPending, isError } = useQuery({
    queryKey: ["board-games", pageIndex],
    queryFn: async () =>
      await getBoardGames({ page_index: pageIndex, page_size: PAGE_SIZE }),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load board games.</p>;

  return (
    <Page id="board-games-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
          columns={[
            { header: "Title", cell: (bg) => bg.title },
            {
              header: "Players",
              cell: (bg) => `${bg.minPlayers} – ${bg.maxPlayers}`,
            },
            { header: "Playtime (min)", cell: (bg) => bg.playTime },
            { header: "Difficulty", cell: (bg) => bg.difficulty },
            { header: "BGG ID", cell: (bg) => bg.bggId },
          ]}
          onRowClick={setSelectedBoardGame}
          title="Board Games"
          cta={
            <Button variant="white" onClick={() => setCreateOpen(true)}>
              Create new
            </Button>
          }
          getRowKey={(bg) => bg.id}
          getRowAriaLabel={(bg) => `Edit ${bg.title}`}
        />
      ) : null}

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
