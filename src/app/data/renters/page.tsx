"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { Renter } from "@/app/util/types";
import { getRenters } from "@/app/util/worker-requests/renters";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateRenterForm } from "./create-renter-form";
import { ModifyRenterForm } from "./modify-renter-form";

// @todo use SSR for table data fetching
export default function RentersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 25;
  const { data, isPending, isError } = useQuery({
    queryKey: ["renters", pageIndex],
    queryFn: async () =>
      await getRenters({ page_index: pageIndex, page_size: PAGE_SIZE }),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load renters.</p>;

  return (
    <Page id="renters-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
          columns={[
            { header: "Name", cell: (renter) => renter.name },
            { header: "Quest ID", cell: (renter) => renter.questId },
          ]}
          onRowClick={setSelectedRenter}
          title="Renters"
          cta={
            <Button variant="white" onClick={() => setCreateOpen(true)}>
              Create new
            </Button>
          }
          getRowKey={(renter) => renter.id}
          getRowAriaLabel={(renter) => `Edit ${renter.name}`}
        />
      ) : null}

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
