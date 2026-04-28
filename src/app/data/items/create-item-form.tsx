"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import {
  SearchSelect,
  SearchSelectItem,
} from "@/app/components/search-select/search-select.client";
import { ItemType } from "@/app/util/types";
import { searchBoardGames } from "@/app/util/worker-requests/board-games";
import { sendCreateItemRequest } from "@/app/util/worker-requests/items";
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
  const [boardGameId, setBoardGameId] = useState<string | null>(null);

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
      board_game_id: type === "board_game" ? boardGameId : null,
    });
  };

  return (
    <DrawerForm
      className="create-item-form drawer-form"
      onSubmit={handleSubmit}
    >
      <NameField name={name} setName={setName} />
      <TypeField type={type} setType={setType} />
      {type === "board_game" ? (
        <BoardGameSearchField
          boardGameId={boardGameId}
          onSelect={(item) => setBoardGameId(item?.value ?? null)}
        />
      ) : null}

      <Button variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create item"}
      </Button>
    </DrawerForm>
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

async function handleBoardGameSearch(q: string): Promise<SearchSelectItem[]> {
  const results = await searchBoardGames(q);
  return results.map((bg) => ({ label: bg.title, value: bg.id }));
}

function BoardGameSearchField({
  boardGameId,
  onSelect,
}: {
  boardGameId: string | null;
  onSelect: (item: SearchSelectItem | null) => void;
}) {
  return (
    <Column className="form-field">
      <label>Board game</label>
      <SearchSelect
        name="create-item-form"
        onSearch={handleBoardGameSearch}
        onSelect={onSelect}
        value={boardGameId}
        placeholder="Search by title..."
      />
    </Column>
  );
}
