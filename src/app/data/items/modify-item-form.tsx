"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import {
  SearchSelect,
  SearchSelectItem,
} from "@/app/components/search-select/search-select.client";
import { BoardGame, Item } from "@/app/util/types";
import { searchBoardGames } from "@/app/util/worker-requests/board-games";
import {
  sendDeleteItemRequest,
  sendModifyItemRequest,
} from "@/app/util/worker-requests/items";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState(item.name);
  const [boardGameId, setBoardGameId] = useState<string | null>(
    item.boardGameId,
  );

  const { data: initialBoardGame } = useQuery<BoardGame | null>({
    queryKey: ["board-games", item.boardGameId],
    queryFn: async () => {
      const res = await fetch(`/api/board-games?page_size=100`);
      const json = await res.json();
      return (
        (json.data as BoardGame[]).find((bg) => bg.id === item.boardGameId) ??
        null
      );
    },
    enabled: !!item.boardGameId,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: modifyItem, isPending: isModificationPending } = useMutation({
    mutationFn: sendModifyItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({ title: `${name} successfully updated` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const { mutate: deleteItem, isPending: isDeletionPending } = useMutation({
    mutationFn: sendDeleteItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({ title: `${item.name} successfully deleted` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Failed to delete item. Please try again." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    modifyItem({
      id: item.id,
      name,
      board_game_id: item.type === "board_game" ? boardGameId : undefined,
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteItem(item.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <DrawerForm className="modify-item-form" onSubmit={handleSubmit}>
        <NameField name={name} setName={setName} />
        {item.type === "board_game" ? (
          <BoardGameSearchField
            boardGameId={boardGameId}
            displayValue={initialBoardGame?.title}
            onSelect={(selected) => setBoardGameId(selected?.value ?? null)}
          />
        ) : null}

        <Column className="buttons">
          <Button variant="pink" onClick={() => {}} disabled={isPending}>
            {isModificationPending ? "Saving..." : "Save changes"}
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isPending}
          >
            {isDeletionPending ? "Deleting..." : "Delete item"}
          </Button>
        </Column>
      </DrawerForm>
      <DeleteDialog
        item={item}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

function NameField({
  name,
  setName,
}: {
  name: string;
  setName: (val: string) => void;
}) {
  return (
    <Column className="form-field">
      <label htmlFor="modify-item-name">Name</label>
      <input
        id="modify-item-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </Column>
  );
}

async function handleBoardGameSearch(q: string): Promise<SearchSelectItem[]> {
  const results = await searchBoardGames(q);
  return results.map((bg) => ({ label: bg.title, value: bg.id }));
}

function BoardGameSearchField({
  boardGameId,
  displayValue,
  onSelect,
}: {
  boardGameId: string | null;
  displayValue?: string;
  onSelect: (item: SearchSelectItem | null) => void;
}) {
  return (
    <Column className="form-field">
      <label>Board game</label>
      <SearchSelect
        name="modify-item-form"
        onSearch={handleBoardGameSearch}
        onSelect={onSelect}
        value={boardGameId}
        displayValue={displayValue}
        placeholder="Search by title..."
      />
    </Column>
  );
}

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
