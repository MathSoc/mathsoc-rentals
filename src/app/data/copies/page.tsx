"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Row } from "@/app/components/layout/layout-components";
import { Page } from "@/app/components/page/page-component";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./copies.scss";
import { CreateCopyForm } from "./create-copy-form";
import { ModifyCopyForm } from "./modify-copy-form";

type Copy = {
  id: string;
  itemId: string;
  copyNumber: number;
  physicalIdentifier: string | null;
  physicalLocation: string | null;
  condition: string;
  status: "available" | "rented" | "missing" | "maintenance" | "retired";
  ownerClubId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// @todo use SSR for table data fetching
export default function CopiesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null);

  const fetchCopies = async (): Promise<GetManyResponse<Copy>> => {
    const res = await fetch("/api/copies?page_size=100");
    if (!res.ok) throw new Error("Failed to fetch copies");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["copies"],
    queryFn: fetchCopies,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load copies.</p>;

  const handleRowKeyDown = (e: React.KeyboardEvent, copy: Copy) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedCopy(copy);
    }
  };

  return (
    <Page id="copies-page" wide>
      <Row className="title-row">
        <h1>Copies</h1>
        <Button variant="pink" onClick={() => setCreateOpen(true)}>
          Create new
        </Button>
      </Row>

      <table className="copies-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Copy #</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((copy) => (
            <tr
              key={copy.id}
              className="copies-table-row"
              onClick={() => setSelectedCopy(copy)}
              onKeyDown={(e) => handleRowKeyDown(e, copy)}
              tabIndex={0}
              aria-label={`Edit Copy #${copy.copyNumber}`}
            >
              <td>{copy.itemId}</td>
              <td>{copy.copyNumber}</td>
              <td>{copy.status}</td>
              <td>{copy.condition}</td>
              <td>{copy.physicalLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new copy"
      >
        <CreateCopyForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedCopy !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCopy(null);
          }
        }}
        title={`Edit Copy #${selectedCopy?.copyNumber}`}
      >
        {selectedCopy ? (
          <ModifyCopyForm
            copy={selectedCopy}
            onSuccess={() => setSelectedCopy(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
