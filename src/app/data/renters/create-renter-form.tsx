"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { sendCreateRenterRequest } from "@/app/util/worker-requests/renters";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateRenterFormProps = {
  onSuccess: () => void;
};

export const CreateRenterForm: React.FC<CreateRenterFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState("");
  const [questId, setQuestId] = useState("");

  const { mutate: createRenter, isPending } = useMutation({
    mutationFn: sendCreateRenterRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renters"] });
      addToast({ title: `${name} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createRenter({ name, questId });
  };

  return (
    <DrawerForm className="create-renter-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label htmlFor="renter-name">Name</label>
        <input
          id="renter-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="renter-quest-id">Quest ID</label>
        <input
          id="renter-quest-id"
          type="text"
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
          required
        />
      </Column>

      <Button variant="pink" disabled={isPending}>
        {isPending ? "Creating..." : "Create renter"}
      </Button>
    </DrawerForm>
  );
};
