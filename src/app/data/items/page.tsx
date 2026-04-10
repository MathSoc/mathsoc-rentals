"use client";

import { useQuery } from "@tanstack/react-query";
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

async function fetchItems(): Promise<ItemsResponse> {
  const res = await fetch("/api/items?page_size=100");
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

// @todo use SSR for table data fetching
export default function ItemsPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load items.</p>;

  return (
    <main className="wide-contents">
      <h1>Items</h1>
      <table className="items-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>BGG ID</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.boardGameId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
