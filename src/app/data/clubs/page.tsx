"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Table } from "@/app/components/table/table.client";
import { Club } from "@/app/util/types";
import { getClubs } from "@/app/util/worker-requests/clubs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateClubForm } from "./create-club-form";
import { ModifyClubForm } from "./modify-club-form";

// @todo use SSR for table data fetching
export default function ClubsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 25;
  const { data, isPending, isError } = useQuery({
    queryKey: ["clubs", pageIndex],
    queryFn: async () =>
      await getClubs({ page_index: pageIndex, page_size: PAGE_SIZE }),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load clubs.</p>;

  return (
    <Page id="clubs-page" wide>
      {data ? (
        <Table
          rows={data.data}
          page={data.meta}
          setPageIndex={setPageIndex}
          columns={[{ header: "Name", cell: (club) => club.name }]}
          onRowClick={setSelectedClub}
          title="Clubs"
          cta={
            <Button variant="white" onClick={() => setCreateOpen(true)}>
              Create new
            </Button>
          }
          getRowKey={(club) => club.id}
          getRowAriaLabel={(club) => `Edit ${club.name}`}
        />
      ) : null}

      <DrawerPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new club"
      >
        <CreateClubForm onSuccess={() => setCreateOpen(false)} />
      </DrawerPanel>

      <DrawerPanel
        open={selectedClub !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedClub(null);
        }}
        title={`Edit ${selectedClub?.name}`}
      >
        {selectedClub ? (
          <ModifyClubForm
            club={selectedClub}
            onSuccess={() => setSelectedClub(null)}
          />
        ) : null}
      </DrawerPanel>
    </Page>
  );
}
