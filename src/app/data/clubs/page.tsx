"use client";

import { GetManyResponse } from "@/app/api/types";
import { Button } from "@/app/components/button/button.client";
import { DataTable } from "@/app/components/data-table/data-table.client";
import { DrawerPanel } from "@/app/components/drawer/drawer.client";
import { Page } from "@/app/components/page/page-component";
import { Club } from "@/app/util/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateClubForm } from "./create-club-form";
import { ModifyClubForm } from "./modify-club-form";

type ClubRow = Club & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// @todo use SSR for table data fetching
export default function ClubsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubRow | null>(null);

  const fetchClubs = async (): Promise<GetManyResponse<ClubRow>> => {
    const res = await fetch("/api/clubs?page_size=100");
    if (!res.ok) throw new Error("Failed to fetch clubs");
    return res.json();
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load clubs.</p>;

  return (
    <Page id="clubs-page" wide>
      <DataTable
        rows={data.data}
        columns={[{ header: "Name", cell: (club) => club.name }]}
        onRowClick={setSelectedClub}
        title="Clubs"
        cta={
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
            Create new
          </Button>
        }
        getRowKey={(club) => club.id}
        getRowAriaLabel={(club) => `Edit ${club.name}`}
      />

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
