"use client";

import { Button } from "@/app/components/button/button.client";
import { ItemType } from "@/app/util/types";
import { createItem } from "@/app/util/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateItemFormProps = {
  onSuccess: () => void;
};

export const CreateItemForm: React.FC<CreateItemFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<ItemType>("calculator");
  const [boardGameId, setBoardGameId] = useState("");

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      type,
      board_game_id: type === "board_game" ? boardGameId || null : null,
    });
  };

  return (
    <form className="create-item-form drawer-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="item-name">Name</label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="item-type">Type</label>
        <select
          id="item-type"
          value={type}
          onChange={(e) => setType(e.target.value as ItemType)}
        >
          <option value="calculator">Calculator</option>
          <option value="textbook">Textbook</option>
          <option value="board_game">Board game</option>
        </select>
      </div>

      {type === "board_game" && (
        <div className="form-field">
          <label htmlFor="item-bgg-id">BGG ID</label>
          <input
            id="item-bgg-id"
            type="text"
            value={boardGameId}
            onChange={(e) => setBoardGameId(e.target.value)}
          />
        </div>
      )}

      {mutation.isError && (
        <p className="form-error">Something went wrong. Please try again.</p>
      )}

      <Button variant="pink" onClick={() => {}} disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create item"}
      </Button>
    </form>
  );
};
