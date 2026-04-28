"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { Rental } from "@/app/util/types";
import { ExpandedRental, getRentals } from "@/app/util/worker-requests/rentals";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateRentalForm } from "./create-rental-form";
import { ModifyRentalForm } from "./modify-rental-form";

function getRentalStatus(rental: Rental): string {
  if (rental.cancelledAt) return "cancelled";
  if (rental.dateReturned) return "returned";
  return "active";
}

// @todo use SSR for table data fetching
export default function RentalsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<ExpandedRental | null>(
    null,
  );
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 25;
  const { data, isPending, isError } = useQuery({
    queryKey: ["rentals", pageIndex],
    queryFn: async () =>
      await getRentals({ page_index: pageIndex, page_size: PAGE_SIZE }, [
        "board_games",
        "renters",
        "clubs",
      ]),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load rentals.</p>;

  return (
    <Page id="rentals-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
          columns={[
            { header: "Renter", cell: (rental) => rental.renter?.name },
            {
              header: "Copy",
              cell: (rental) => `${rental.item?.name} ${rental.copy?.barcode}`,
            },
            { header: "Renting club", cell: (rental) => rental.club?.name },
            { header: "Status", cell: (rental) => getRentalStatus(rental) },
            { header: "Checkout", cell: (rental) => rental.checkoutDate },
            { header: "Due", cell: (rental) => rental.dueDate },
          ]}
          onRowClick={setSelectedRental}
          title="Rentals"
          cta={<Button onClick={() => setCreateOpen(true)}>Create new</Button>}
          getRowKey={(rental) => rental.id}
          getRowAriaLabel={(rental) => `Edit rental for ${rental.renterId}`}
        />
      ) : null}

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new rental"
      >
        <CreateRentalForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedRental !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRental(null);
        }}
        title="Edit rental"
      >
        {selectedRental ? (
          <ModifyRentalForm
            rental={selectedRental}
            onSuccess={() => setSelectedRental(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
