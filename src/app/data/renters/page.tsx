"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Renter } from "@/app/util/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateRenterForm } from "./create-renter-form";
import { ModifyRenterForm } from "./modify-renter-form";

type RenterRow = Renter & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// @todo use SSR for table data fetching
export default function RentersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState<RenterRow | null>(null);

  const fetchRenters = async (): Promise<GetManyResponse<RenterRow>> => {
    const res = await fetch("/api/renters?page_size=100");
    if (!res.ok) throw new Error("Failed to fetch renters");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["renters"],
    queryFn: fetchRenters,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load renters.</p>;

  return (
    <Page id="renters-page" wide>
      <DataTable
        rows={data.data}
        columns={[
          { header: "Name", cell: (renter) => renter.name },
          { header: "Quest ID", cell: (renter) => renter.questId },
        ]}
        onRowClick={setSelectedRenter}
        title="Renters"
        cta={
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(renter) => renter.id}
        getRowAriaLabel={(renter) => `Edit ${renter.name}`}
      />

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new renter"
      >
        <CreateRenterForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedRenter !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRenter(null);
        }}
        title={`Edit ${selectedRenter?.name}`}
      >
        {selectedRenter ? (
          <ModifyRenterForm
            renter={selectedRenter}
            onSuccess={() => setSelectedRenter(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
