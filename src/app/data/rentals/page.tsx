"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { BoardGame, Club, Copy, Item, Rental, Renter } from "@/app/util/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateRentalForm } from "./create-rental-form";
import { ModifyRentalForm } from "./modify-rental-form";

function getRentalStatus(rental: Rental): string {
  if (rental.cancelledAt) return "cancelled";
  if (rental.dateReturned) return "returned";
  return "active";
}

type ExpandedRental = Rental & {
  renter: Renter | null;
  item: Item | null;
  copy: Copy | null;
  board_game: BoardGame | null;
  club: Club | null;
};

// @todo use SSR for table data fetching
export default function RentalsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const fetchRentals = async (): Promise<GetManyResponse<ExpandedRental>> => {
    const res = await fetch(
      `/api/rentals?page_size=100&expand=["board_games", "renters", "clubs"]`,
    );
    if (!res.ok) throw new Error("Failed to fetch rentals");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["rentals"],
    queryFn: fetchRentals,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load rentals.</p>;

  return (
    <Page id="rentals-page" wide>
      <DataTable
        rows={data.data}
        columns={[
          { header: "Renter", cell: (rental) => rental.renter?.name },
          {
            header: "Copy",
            cell: (rental) => `${rental.item?.name} ${rental.copy?.copyNumber}`,
          },
          { header: "Owner", cell: (rental) => rental.club?.name },
          { header: "Status", cell: (rental) => getRentalStatus(rental) },
          { header: "Checkout", cell: (rental) => rental.checkoutDate },
          { header: "Due", cell: (rental) => rental.dueDate },
        ]}
        onRowClick={setSelectedRental}
        title="Rentals"
        cta={
          <Button variant="white" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(rental) => rental.id}
        getRowAriaLabel={(rental) => `Edit rental for ${rental.renterId}`}
      />

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
