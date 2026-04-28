"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { sendCreateBoardGameRequest } from "@/app/util/worker-requests/board-games";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateBoardGameFormProps = {
  onSuccess: () => void;
};

export const CreateBoardGameForm: React.FC<CreateBoardGameFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [title, setTitle] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [playtime, setPlaytime] = useState(30);
  const [bggId, setBggId] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const { mutate: createBoardGame, isPending } = useMutation({
    mutationFn: sendCreateBoardGameRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-games"] });
      addToast({ title: `${title} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createBoardGame({
      title,
      min_players: minPlayers,
      max_players: maxPlayers,
      playtime,
      bgg_id: bggId || undefined,
      difficulty: difficulty || undefined,
    });
  };

  return (
    <DrawerForm className="create-board-game-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label htmlFor="board-game-title">Title</label>
        <input
          id="board-game-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="board-game-min-players">Min players</label>
        <input
          id="board-game-min-players"
          type="number"
          min={1}
          value={minPlayers}
          onChange={(e) => setMinPlayers(parseInt(e.target.value))}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="board-game-max-players">Max players</label>
        <input
          id="board-game-max-players"
          type="number"
          min={1}
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="board-game-playtime">Playtime (minutes)</label>
        <input
          id="board-game-playtime"
          type="number"
          min={1}
          value={playtime}
          onChange={(e) => setPlaytime(parseInt(e.target.value))}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="board-game-difficulty">Difficulty</label>
        <input
          id="board-game-difficulty"
          type="text"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="board-game-bgg-id">BGG ID</label>
        <input
          id="board-game-bgg-id"
          type="text"
          value={bggId}
          onChange={(e) => setBggId(e.target.value)}
        />
      </Column>

      <Button variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create board game"}
      </Button>
    </DrawerForm>
  );
};
