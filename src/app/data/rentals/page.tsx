"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Rental } from "@/app/util/types";
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
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const fetchRentals = async (): Promise<GetManyResponse<Rental>> => {
    const res = await fetch("/api/rentals?page_size=100");
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
          { header: "Renter ID", cell: (rental) => rental.renterId },
          { header: "Copy ID", cell: (rental) => rental.copyId },
          { header: "Status", cell: (rental) => getRentalStatus(rental) },
          { header: "Checkout", cell: (rental) => rental.checkoutDate },
          { header: "Due", cell: (rental) => rental.dueDate },
        ]}
        onRowClick={setSelectedRental}
        title="Rentals"
        cta={
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
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
