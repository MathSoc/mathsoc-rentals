"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import {
  SearchSelect,
  SearchSelectItem,
} from "@/app/components/search-select/search-select.client";
import { CopyStatus } from "@/app/util/types";
import { sendCreateCopyRequest } from "@/app/util/worker-requests/copies";
import { searchItems } from "@/app/util/worker-requests/items";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateCopyFormProps = {
  onSuccess: () => void;
};

type ClubOption = {
  id: string;
  name: string;
};

type ClubsResponse = {
  data: ClubOption[];
};

async function handleItemSearch(q: string): Promise<SearchSelectItem[]> {
  const results = await searchItems(q);
  return results.map((item) => ({ label: item.name, value: item.id }));
}

export const CreateCopyForm: React.FC<CreateCopyFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [itemId, setItemId] = useState<string | null>(null);
  const [barcode, setBarcode] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState<CopyStatus>("available");
  const [copyLabel, setCopyLabel] = useState("");
  const [physicalLocation, setPhysicalLocation] = useState("");
  const [ownerClubId, setOwnerClubId] = useState("");

  const { data: clubsData } = useQuery<ClubsResponse>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await fetch("/api/clubs?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  const { mutate: createCopy, isPending } = useMutation({
    mutationFn: sendCreateCopyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] });
      addToast({ title: `Copy #${barcode} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemId) {
      addToast({ title: "No item selected" });
      return;
    }

    createCopy({
      item_id: itemId,
      barcode: barcode,
      condition,
      status,
      copy_label: copyLabel || undefined,
      physical_location: physicalLocation || undefined,
      owner_club_id: ownerClubId,
    });
  };

  return (
    <DrawerForm className="create-copy-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label>Item</label>
        <SearchSelect
          name="create-copy-form"
          onSearch={handleItemSearch}
          onSelect={(item) => setItemId(item?.value ?? null)}
          value={itemId}
          placeholder="Search by name..."
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="barcode">Barcode</label>
        <input
          id="barcode"
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-condition">Condition</label>
        <input
          id="copy-condition"
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-status">Status</label>
        <select
          id="copy-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CopyStatus)}
        >
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="missing">Missing</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-copy-label">Copy label</label>
        <input
          id="copy-copy-label"
          type="text"
          value={copyLabel}
          onChange={(e) => setCopyLabel(e.target.value)}
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-physical-location">Physical location</label>
        <input
          id="copy-physical-location"
          type="text"
          value={physicalLocation}
          onChange={(e) => setPhysicalLocation(e.target.value)}
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-owner-club-id">Owner club</label>
        <select
          id="copy-owner-club-id"
          value={ownerClubId}
          onChange={(e) => setOwnerClubId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a club
          </option>
          {clubsData?.data.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </Column>

      <Button variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create copy"}
      </Button>
    </DrawerForm>
  );
};
