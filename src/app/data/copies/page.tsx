"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Item } from "@/app/util/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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

  const fetchCopies = async (): Promise<
    GetManyResponse<Copy & { item: Item | null }>
  > => {
    const res = await fetch(`/api/copies?page_size=100&expand=["items"]`);
    if (!res.ok) throw new Error("Failed to fetch copies");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["copies"],
    queryFn: fetchCopies,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load copies.</p>;

  return (
    <Page id="copies-page" wide>
      <DataTable
        rows={data.data}
        columns={[
          { header: "Item", cell: (copy) => copy.item?.name },
          { header: "Copy #", cell: (copy) => copy.copyNumber },
          { header: "Status", cell: (copy) => copy.status },
          { header: "Condition", cell: (copy) => copy.condition },
          { header: "Location", cell: (copy) => copy.physicalLocation },
        ]}
        onRowClick={setSelectedCopy}
        title="Copies"
        cta={
          <Button variant="white" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(copy) => copy.id}
        getRowAriaLabel={(copy) => `Edit Copy #${copy.copyNumber}`}
      />

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
