"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { CopyStatus } from "@/app/util/types";
import { sendCreateCopyRequest } from "@/app/util/worker-requests/copies";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateCopyFormProps = {
  onSuccess: () => void;
};

type ItemOption = {
  id: string;
  name: string;
};

type ItemsResponse = {
  data: ItemOption[];
};

export const CreateCopyForm: React.FC<CreateCopyFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [itemId, setItemId] = useState("");
  const [copyNumber, setCopyNumber] = useState(1);
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState<CopyStatus>("available");
  const [physicalIdentifier, setPhysicalIdentifier] = useState("");
  const [physicalLocation, setPhysicalLocation] = useState("");
  const [ownerClubId, setOwnerClubId] = useState("");

  const { data: itemsData } = useQuery<ItemsResponse>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const { mutate: createCopy, isPending } = useMutation({
    mutationFn: sendCreateCopyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] });
      addToast({ title: `Copy #${copyNumber} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCopy({
      item_id: itemId,
      copy_number: copyNumber,
      condition,
      status,
      physical_identifier: physicalIdentifier || undefined,
      physical_location: physicalLocation || undefined,
      owner_club_id: ownerClubId,
    });
  };

  return (
    <DrawerForm className="create-copy-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label htmlFor="copy-item-id">Item</label>
        <select
          id="copy-item-id"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select an item
          </option>
          {itemsData?.data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </Column>

      <Column className="form-field">
        <label htmlFor="copy-number">Copy number</label>
        <input
          id="copy-number"
          type="number"
          min={1}
          value={copyNumber}
          onChange={(e) => setCopyNumber(parseInt(e.target.value))}
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
        <label htmlFor="copy-physical-identifier">Physical identifier</label>
        <input
          id="copy-physical-identifier"
          type="text"
          value={physicalIdentifier}
          onChange={(e) => setPhysicalIdentifier(e.target.value)}
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
        <label htmlFor="copy-owner-club-id">Owner club ID</label>
        <input
          id="copy-owner-club-id"
          type="text"
          value={ownerClubId}
          onChange={(e) => setOwnerClubId(e.target.value)}
          required
        />
      </Column>

      <Button variant="pink" disabled={isPending}>
        {isPending ? "Creating..." : "Create copy"}
      </Button>
    </DrawerForm>
  );
};
