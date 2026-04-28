"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { sendCreateClubRequest } from "@/app/util/worker-requests/clubs";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateClubFormProps = {
  onSuccess: () => void;
};

export const CreateClubForm: React.FC<CreateClubFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState("");

  const { mutate: createClub, isPending } = useMutation({
    mutationFn: sendCreateClubRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      addToast({ title: `${name} successfully created` });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createClub({ name });
  };

  return (
    <DrawerForm className="create-club-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label htmlFor="club-name">Name</label>
        <input
          id="club-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Column>

      <Button variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create club"}
      </Button>
    </DrawerForm>
  );
};
