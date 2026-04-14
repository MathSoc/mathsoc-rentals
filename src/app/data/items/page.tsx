"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateItemForm } from "./create-item-form";
import { ModifyItemForm } from "./modify-item-form";

type Item = {
  id: string;
  name: string;
  type: "board_game" | "calculator" | "textbook";
  boardGameId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// @todo use SSR for table data fetching
export default function ItemsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async (): Promise<GetManyResponse<Item>> => {
    const res = await fetch("/api/items?page_size=100");
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load items.</p>;

  return (
    <Page id="items-page" wide>
      <DataTable
        rows={data.data}
        columns={[
          { header: "Name", cell: (item) => item.name },
          { header: "Type", cell: (item) => item.type },
          { header: "BGG ID", cell: (item) => item.boardGameId },
        ]}
        onRowClick={setSelectedItem}
        title="Items"
        cta={
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(item) => item.id}
        getRowAriaLabel={(item) => `Edit ${item.name}`}
      />

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
