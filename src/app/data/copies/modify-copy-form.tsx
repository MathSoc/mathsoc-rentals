"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { Column } from "@/app/components/layout/layout-components";
import { Copy, CopyStatus } from "@/app/util/types";
import { sendDeleteCopyRequest, sendModifyCopyRequest } from "@/app/util/util";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyCopyFormProps = {
  copy: Copy;
  onSuccess: () => void;
};

type ItemOption = {
  id: string;
  name: string;
};

type ItemsResponse = {
  data: ItemOption[];
};

export const ModifyCopyForm: React.FC<ModifyCopyFormProps> = ({
  copy,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [itemId, setItemId] = useState(copy.itemId);
  const [copyNumber, setCopyNumber] = useState(copy.copyNumber);
  const [condition, setCondition] = useState(copy.condition);
  const [status, setStatus] = useState<CopyStatus>(copy.status);
  const [physicalIdentifier, setPhysicalIdentifier] = useState(
    copy.physicalIdentifier ?? "",
  );
  const [physicalLocation, setPhysicalLocation] = useState(
    copy.physicalLocation ?? "",
  );
  const [ownerClubId, setOwnerClubId] = useState(copy.ownerClubId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: itemsData } = useQuery<ItemsResponse>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const { mutate: modifyCopy, isPending: isModificationPending } = useMutation({
    mutationFn: sendModifyCopyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] });
      addToast({ title: `Copy #${copyNumber} successfully updated` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const { mutate: deleteCopy, isPending: isDeletionPending } = useMutation({
    mutationFn: sendDeleteCopyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] });
      addToast({ title: `Copy #${copy.copyNumber} successfully deleted` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Failed to delete copy. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    modifyCopy({
      id: copy.id,
      item_id: itemId,
      copy_number: copyNumber,
      condition,
      status,
      physical_identifier: physicalIdentifier || undefined,
      physical_location: physicalLocation || undefined,
      owner_club_id: ownerClubId,
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteCopy(copy.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <form className="modify-copy-form drawer-form" onSubmit={handleSubmit}>
        <Column className="form-field">
          <label htmlFor="modify-copy-item-id">Item</label>
          <select
            id="modify-copy-item-id"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          >
            {itemsData?.data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-copy-number">Copy number</label>
          <input
            id="modify-copy-number"
            type="number"
            min={1}
            value={copyNumber}
            onChange={(e) => setCopyNumber(parseInt(e.target.value))}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-copy-condition">Condition</label>
          <input
            id="modify-copy-condition"
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-copy-status">Status</label>
          <select
            id="modify-copy-status"
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
          <label htmlFor="modify-copy-physical-identifier">
            Physical identifier
          </label>
          <input
            id="modify-copy-physical-identifier"
            type="text"
            value={physicalIdentifier}
            onChange={(e) => setPhysicalIdentifier(e.target.value)}
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-copy-physical-location">
            Physical location
          </label>
          <input
            id="modify-copy-physical-location"
            type="text"
            value={physicalLocation}
            onChange={(e) => setPhysicalLocation(e.target.value)}
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-copy-owner-club-id">Owner club ID</label>
          <input
            id="modify-copy-owner-club-id"
            type="text"
            value={ownerClubId}
            onChange={(e) => setOwnerClubId(e.target.value)}
            required
          />
        </Column>

        <Column className="buttons">
          <Button variant="pink" disabled={isPending}>
            {isModificationPending ? "Saving..." : "Save changes"}
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isPending}
          >
            {isDeletionPending ? "Deleting..." : "Delete copy"}
          </Button>
        </Column>
      </form>

      <DeleteDialog
        copy={copy}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

function DeleteDialog({
  copy,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  copy: Copy;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete copy">
      <p>Are you sure you want to delete Copy #{copy.copyNumber}?</p>
      <Column className="buttons">
        <Button variant="destructive" onClick={onDeleteConfirm}>
          Confirm
        </Button>
        <Button variant="white" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Column>
    </Dialog>
  );
}
