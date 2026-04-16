"use client";

import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
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

  const { data, isPending, isError } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => await getClubs({ page_index: 0, page_size: 100 }),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load clubs.</p>;

  return (
    <Page id="clubs-page" wide>
      {data ? (
        <DataTable
          rows={data}
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
