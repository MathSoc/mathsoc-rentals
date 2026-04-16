"use client";

import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { BoardGame, Item } from "@/app/util/types";
import { getItems } from "@/app/util/worker-requests/items";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateItemForm } from "./create-item-form";
import { ModifyItemForm } from "./modify-item-form";

type ItemWithBoardGame = Item & { board_game?: BoardGame };

// @todo use SSR for table data fetching
export default function ItemsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithBoardGame | null>(
    null,
  );

  const { data, isPending, isError } = useQuery({
    queryKey: ["items"],
    queryFn: async () =>
      await getItems({ page_index: 0, page_size: 100 }, ["board_games"]),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load items.</p>;

  return (
    <Page id="items-page" wide>
      {data ? (
        <DataTable
          rows={data}
          columns={[
            { header: "Name", cell: (item) => item.name },
            { header: "Type", cell: (item) => item.type },
            { header: "Board game", cell: (item) => item.board_game?.title },
          ]}
          onRowClick={setSelectedItem}
          title="Items"
          cta={
            <Button variant="white" onClick={() => setCreateOpen(true)}>
              Create new
            </Button>
          }
          getRowKey={(item) => item.id}
          getRowAriaLabel={(item) => `Edit ${item.name}`}
        />
      ) : null}

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new item"
      >
        <CreateItemForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
          }
        }}
        title={`Edit ${selectedItem?.name}`}
      >
        {selectedItem ? (
          <ModifyItemForm
            item={selectedItem}
            onSuccess={() => setSelectedItem(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
