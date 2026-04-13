"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Row } from "@/app/components/layout/layout-components";
import { Page } from "@/app/components/page/page-component";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateItemForm } from "./create-item-form";
import "./items.scss";
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

type ItemsResponse = {
  data: Item[];
  meta: {
    total_count: number;
    page_index: number;
    page_size: number;
  };
};

// @todo use SSR for table data fetching
export default function ItemsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async (): Promise<ItemsResponse> => {
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

  const handleRowKeyDown = (e: React.KeyboardEvent, item: Item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedItem(item);
    }
  };

  return (
    <Page id="items-page" wide>
      <Row className="title-row">
        <h1>Items</h1>
        <Button variant="pink" onClick={() => setCreateOpen(true)}>
          Create new
        </Button>
      </Row>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>BGG ID</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item) => (
            <tr
              key={item.id}
              className="items-table-row"
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => handleRowKeyDown(e, item)}
              tabIndex={0}
              aria-label={`Edit ${item.name}`}
            >
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.boardGameId}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
