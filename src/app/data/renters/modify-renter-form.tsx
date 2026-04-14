"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { Renter } from "@/app/util/types";
import {
  sendDeleteRenterRequest,
  sendModifyRenterRequest,
} from "@/app/util/worker-requests/renters";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyRenterFormProps = {
  renter: Renter;
  onSuccess: () => void;
};

export const ModifyRenterForm: React.FC<ModifyRenterFormProps> = ({
  renter,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState(renter.name);
  const [questId, setQuestId] = useState(renter.questId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: modifyRenter, isPending: isModificationPending } =
    useMutation({
      mutationFn: sendModifyRenterRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["renters"] });
        addToast({ title: `${name} successfully updated` });
        onSuccess();
      },
      onError: () => {
        addToast({ title: "Something went wrong. Please try again." });
      },
    });

  const { mutate: deleteRenter, isPending: isDeletionPending } = useMutation({
    mutationFn: sendDeleteRenterRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renters"] });
      addToast({ title: `${renter.name} successfully deleted` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Failed to delete renter. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    modifyRenter({ id: renter.id, name, questId });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteRenter(renter.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <DrawerForm className="modify-renter-form" onSubmit={handleSubmit}>
        <Column className="form-field">
          <label htmlFor="modify-renter-name">Name</label>
          <input
            id="modify-renter-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-renter-quest-id">Quest ID</label>
          <input
            id="modify-renter-quest-id"
            type="text"
            value={questId}
            onChange={(e) => setQuestId(e.target.value)}
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
            {isDeletionPending ? "Deleting..." : "Delete renter"}
          </Button>
        </Column>
      </DrawerForm>

      <DeleteDialog
        renter={renter}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

function DeleteDialog({
  renter,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  renter: Renter;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete renter">
      <p>Are you sure you want to delete &quot;{renter.name}&quot;?</p>
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
