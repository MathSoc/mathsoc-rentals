"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { BoardGame } from "@/app/util/types";
import {
  sendDeleteBoardGameRequest,
  sendModifyBoardGameRequest,
} from "@/app/util/worker-requests/board-games";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyBoardGameFormProps = {
  boardGame: BoardGame;
  onSuccess: () => void;
};

export const ModifyBoardGameForm: React.FC<ModifyBoardGameFormProps> = ({
  boardGame,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [title, setTitle] = useState(boardGame.title);
  const [minPlayers, setMinPlayers] = useState(boardGame.minPlayers ?? 1);
  const [maxPlayers, setMaxPlayers] = useState(boardGame.maxPlayers ?? 1);
  const [playtime, setPlaytime] = useState(boardGame.playTime ?? 30);
  const [bggId, setBggId] = useState(boardGame.bggId ?? "");
  const [difficulty, setDifficulty] = useState(boardGame.difficulty ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: modifyBoardGame, isPending: isModificationPending } =
    useMutation({
      mutationFn: sendModifyBoardGameRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["board-games"] });
        addToast({ title: `${title} successfully updated` });
        onSuccess();
      },
      onError: () => {
        addToast({ title: "Something went wrong. Please try again." });
      },
    });

  const { mutate: deleteBoardGame, isPending: isDeletionPending } = useMutation(
    {
      mutationFn: sendDeleteBoardGameRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["board-games"] });
        addToast({ title: `${boardGame.title} successfully deleted` });
        onSuccess();
      },
      onError: () => {
        addToast({ title: "Failed to delete board game. Please try again." });
      },
    },
  );

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    modifyBoardGame({
      id: boardGame.id,
      title,
      min_players: minPlayers,
      max_players: maxPlayers,
      playtime,
      bgg_id: bggId || undefined,
      difficulty: difficulty || undefined,
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteBoardGame(boardGame.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <DrawerForm className="modify-board-game-form" onSubmit={handleSubmit}>
        <Column className="form-field">
          <label htmlFor="modify-board-game-title">Title</label>
          <input
            id="modify-board-game-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-board-game-min-players">Min players</label>
          <input
            id="modify-board-game-min-players"
            type="number"
            min={1}
            value={minPlayers}
            onChange={(e) => setMinPlayers(parseInt(e.target.value))}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-board-game-max-players">Max players</label>
          <input
            id="modify-board-game-max-players"
            type="number"
            min={1}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-board-game-playtime">Playtime (minutes)</label>
          <input
            id="modify-board-game-playtime"
            type="number"
            min={1}
            value={playtime}
            onChange={(e) => setPlaytime(parseInt(e.target.value))}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-board-game-difficulty">Difficulty</label>
          <input
            id="modify-board-game-difficulty"
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-board-game-bgg-id">BGG ID</label>
          <input
            id="modify-board-game-bgg-id"
            type="text"
            value={bggId}
            onChange={(e) => setBggId(e.target.value)}
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
            {isDeletionPending ? "Deleting..." : "Delete board game"}
          </Button>
        </Column>
      </DrawerForm>

      <DeleteDialog
        boardGame={boardGame}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

function DeleteDialog({
  boardGame,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  boardGame: BoardGame;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete board game">
      <p>Are you sure you want to delete &quot;{boardGame.title}&quot;?</p>
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
