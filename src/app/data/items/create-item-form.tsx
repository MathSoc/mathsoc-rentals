"use client";

import { Button } from "@/app/components/button/button.client";
import { Column } from "@/app/components/layout/layout-components";
import { ItemType } from "@/app/util/types";
import { sendCreateItemRequest } from "@/app/util/util";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateItemFormProps = {
  onSuccess: () => void;
};

export const CreateItemForm: React.FC<CreateItemFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState("");
  const [type, setType] = useState<ItemType>("calculator");
  const [boardGameId, setBoardGameId] = useState("");

  const { mutate: createItem, isPending } = useMutation({
    mutationFn: sendCreateItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({ title: `${name} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItem({
      name,
      type,
      board_game_id: type === "board_game" ? boardGameId || null : null,
    });
  };

  return (
    <form className="create-item-form drawer-form" onSubmit={handleSubmit}>
      <NameField name={name} setName={setName} />
      <TypeField type={type} setType={setType} />
      {boardGameId ? (
        <BGGIdField boardGameId={boardGameId} setBoardGameId={setBoardGameId} />
      ) : null}

      <Button variant="pink" disabled={isPending}>
        {isPending ? "Creating..." : "Create item"}
      </Button>
    </form>
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
      <label htmlFor="item-name">Name</label>
      <input
        id="item-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </Column>
  );
}

function TypeField({
  type,
  setType,
}: {
  type: ItemType;
  setType: (val: ItemType) => void;
}) {
  return (
    <Column className="form-field">
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
    </Column>
  );
}

function BGGIdField({
  boardGameId,
  setBoardGameId,
}: {
  boardGameId: string;
  setBoardGameId: (newVal: string) => void;
}) {
  return (
    <Column className="form-field">
      <label htmlFor="item-bgg-id">BGG ID</label>
      <input
        id="item-bgg-id"
        type="text"
        value={boardGameId}
        onChange={(e) => setBoardGameId(e.target.value)}
      />
    </Column>
  );
}
