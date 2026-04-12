"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Row } from "@/app/components/layout/layout-components";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateItemForm } from "./create-item-form";
import "./items.scss";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  return (
    <main className="wide-contents">
      <Row className="title-row">
        <h1>Items</h1>
        <Button variant="pink" onClick={() => setDrawerOpen(true)}>
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
          {/* {data.data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.boardGameId}</td>
            </tr>
          ))} */}
        </tbody>
      </table>

      <DrawerPanel
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Create new item"
      >
        <CreateItemForm onSuccess={() => setDrawerOpen(false)} />
      </DrawerPanel>
    </main>
  );
}
