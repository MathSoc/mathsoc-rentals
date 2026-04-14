"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { Club } from "@/app/util/types";
import {
  sendDeleteClubRequest,
  sendModifyClubRequest,
} from "@/app/util/worker-requests/clubs";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyClubFormProps = {
  club: Club;
  onSuccess: () => void;
};

export const ModifyClubForm: React.FC<ModifyClubFormProps> = ({
  club,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState(club.name);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: modifyClub, isPending: isModificationPending } = useMutation({
    mutationFn: sendModifyClubRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      addToast({ title: `${name} successfully updated` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const { mutate: deleteClub, isPending: isDeletionPending } = useMutation({
    mutationFn: sendDeleteClubRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      addToast({ title: `${club.name} successfully deleted` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Failed to delete club. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    modifyClub({ id: club.id, name });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteClub(club.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <DrawerForm className="modify-club-form" onSubmit={handleSubmit}>
        <Column className="form-field">
          <label htmlFor="modify-club-name">Name</label>
          <input
            id="modify-club-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {isDeletionPending ? "Deleting..." : "Delete club"}
          </Button>
        </Column>
      </DrawerForm>

      <DeleteDialog
        club={club}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

function DeleteDialog({
  club,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  club: Club;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete club">
      <p>Are you sure you want to delete &quot;{club.name}&quot;?</p>
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
