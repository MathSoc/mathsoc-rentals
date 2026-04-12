"use client";

import { Button } from "@/app/components/button/button.client";
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
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
          onClick={handleDelete}
          disabled={isPending}
        >
          {deleteMutation.isPending
            ? "Deleting..."
            : confirmDelete
              ? "Are you sure? Click again to confirm"
              : "Delete item"}
        </Button>
        {confirmDelete && !deleteMutation.isPending && (
          <button
            type="button"
            className="delete-cancel"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
        )}
      </Column>
    </form>
  );
};
