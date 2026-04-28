"use client";

import "./home.scss";

import { Button } from "@/app/components/button/button.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Column } from "../components/layout/layout-components";
import { ExpandedCopy, getCopies } from "../util/worker-requests/copies";

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const PAGE_SIZE = 25;
  const { data } = useQuery({
    queryKey: ["rentals", pageIndex, searchQuery],
    queryFn: async () =>
      await getCopies(
        { page_index: pageIndex, page_size: PAGE_SIZE },
        ["active_rentals", "items", "renters"],
        { q: searchQuery || undefined },
      ),
  });

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPageIndex(0);
  };

  return (
    <Page id="rentals-page" wide>
      <Table
        rows={data?.data}
        page={data?.meta}
        setPageIndex={setPageIndex}
        columns={[
          { header: "Name", cell: (copy) => copy.item?.name },
          {
            header: "Barcode",
            cell: (copy) => `${copy?.barcode}`,
          },
          { header: "Status", cell: (copy) => copy.status },
          { header: "Due", cell: (copy) => copy.rental?.dueDate },
        ]}
        title="Rentals"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        getExpandedRowContents={(r) => <RowExpansion copy={r} />}
        getRowKey={(copy) => copy.id}
        getRowAriaLabel={(copy) => `Edit rental for ${copy.item?.name}`}
      />
    </Page>
  );
}

function RowExpansion({ copy }: { copy: ExpandedCopy }) {
  const router = useRouter();

  if (copy.rental === null) {
    return (
      <Column className="rental-row-expansion">
        <Button
          size="small"
          onClick={() =>
            router.push(
              `/rent/${copy.id}?item=${encodeURIComponent(copy.item?.name ?? "")}&barcode=${encodeURIComponent(copy.barcode)}`,
            )
          }
        >
          Rent
        </Button>
      </Column>
    );
  }

  return (
    <Column className="rental-row-expansion">
      <span>This item is currently out</span>
      <span>
        Rented by <span className="renter-name">{copy.renter?.name}</span>
      </span>
      <span>
        Due <span className="due-date">{copy.rental?.dueDate}</span>
      </span>
    </Column>
  );
}
