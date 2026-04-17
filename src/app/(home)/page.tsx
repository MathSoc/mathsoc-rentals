"use client";

import "./home.scss";

import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { Rental } from "@/app/util/types";
import { ExpandedRental, getRentals } from "@/app/util/worker-requests/rentals";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Column } from "../components/layout/layout-components";

function getRentalStatus(rental: Rental): string {
  if (rental.cancelledAt) return "cancelled";
  if (rental.dateReturned) return "returned";
  return "active";
}

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const PAGE_SIZE = 25;
  const { data } = useQuery({
    queryKey: ["rentals", pageIndex, searchQuery],
    queryFn: async () =>
      await getRentals(
        { page_index: pageIndex, page_size: PAGE_SIZE },
        ["board_games", "renters", "clubs"],
        { status: "active", q: searchQuery || undefined },
      ),
  });

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPageIndex(0);
  };

  return (
    <Page id="rentals-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
          columns={[
            { header: "Name", cell: (rental) => rental.item?.name },
            {
              header: "Copy",
              cell: (rental) => `${rental.item?.name} ${rental.copy?.barcode}`,
            },
            { header: "Status", cell: (rental) => getRentalStatus(rental) },
            { header: "Due", cell: (rental) => rental.dueDate },
          ]}
          title="Rentals"
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          getExpandedRowContents={(r) => <RowExpansion rental={r} />}
          getRowKey={(rental) => rental.id}
          getRowAriaLabel={(rental) => `Edit rental for ${rental.renterId}`}
        />
      ) : null}
    </Page>
  );
}

function RowExpansion({ rental }: { rental: ExpandedRental }) {
  return (
    <Column className="rental-row-expansion">
      <span>This item is currently out</span>
      <span>
        Rented by <span className="renter-name">{rental.renter?.name}</span>
      </span>
      <span>
        Due <span className="due-date">{rental.dueDate}</span>
      </span>
    </Column>
  );
}
