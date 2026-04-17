"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { Copy, Item } from "@/app/util/types";
import { getCopies } from "@/app/util/worker-requests/copies";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateCopyForm } from "./create-copy-form";
import { ModifyCopyForm } from "./modify-copy-form";

type CopyWithItem = Copy & { item: Item | null };

// @todo use SSR for table data fetching
export default function CopiesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState<CopyWithItem | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 25;
  const { data, isPending, isError } = useQuery({
    queryKey: ["copies", pageIndex],
    queryFn: async () =>
      await getCopies({ page_index: pageIndex, page_size: PAGE_SIZE }, [
        "items",
      ]),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load copies.</p>;

  return (
    <Page id="copies-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
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
      ) : null}

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
