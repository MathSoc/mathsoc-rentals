"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { Column } from "@/app/components/layout/layout-components";
import { Item } from "@/app/util/types";
import { deleteItem, modifyItem } from "@/app/util/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyItemFormProps = {
  item: Item;
  onSuccess: () => void;
};

export const ModifyItemForm: React.FC<ModifyItemFormProps> = ({
  item,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [boardGameId, setBoardGameId] = useState(item.boardGameId ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const modifyMutation = useMutation({
    mutationFn: modifyItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      onSuccess();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    modifyMutation.mutate({
      id: item.id,
      name,
      board_game_id:
        item.type === "board_game" ? boardGameId || null : undefined,
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutation.mutate(item.id);
  };

  const isPending = modifyMutation.isPending || deleteMutation.isPending;

  return (
    <form className="create-item-form drawer-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="modify-item-name">Name</label>
        <input
          id="modify-item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {item.type === "board_game" && (
        <div className="form-field">
          <label htmlFor="modify-item-bgg-id">BGG ID</label>
          <input
            id="modify-item-bgg-id"
            type="text"
            value={boardGameId}
            onChange={(e) => setBoardGameId(e.target.value)}
          />
        </div>
      )}

      {modifyMutation.isError && (
        <p className="form-error">Something went wrong. Please try again.</p>
      )}
      {deleteMutation.isError && (
        <p className="form-error">Failed to delete item. Please try again.</p>
      )}

      <Column className="buttons">
        <Button variant="pink" onClick={() => {}} disabled={isPending}>
          {modifyMutation.isPending ? "Saving..." : "Save changes"}
        </Button>

        <Button
          variant="destructive"
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete item"}
        </Button>

        <DeleteDialog
          item={item}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onDeleteConfirm={handleDeleteConfirm}
        />
      </Column>
    </form>
  );
};

function DeleteDialog({
  item,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  item: Item;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete item">
      <p>Are you sure you want to delete &quot;{item.name}&quot;?</p>
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
