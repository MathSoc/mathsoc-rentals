"use client";

import { Button } from "@/app/components/button/button.client";
import { Backdrop } from "@/app/components/backdrop/backdrop";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { Column, Row } from "@/app/components/layout/layout-components";
import {
  SearchSelect,
  SearchSelectItem,
} from "@/app/components/search-select/search-select.client";
import {
  searchRenters,
  sendCreateRenterRequest,
} from "@/app/util/worker-requests/renters";
import { Toast } from "@base-ui/react/toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import "./select-renter-step.scss";

export function SelectRenterStep({
  renterId,
  renterLabel,
  onSelect,
  onNext,
  onCancel,
}: {
  renterId: string;
  renterLabel: string;
  onSelect: (item: SearchSelectItem | null) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const [createRenterOpen, setCreateRenterOpen] = useState(false);

  return (
    <>
      <Backdrop>
        <Column className="rent-wizard-step">
          <h2>Select a renter</h2>
          <Column className="form-field">
            <label>Renter</label>
            <SearchSelect
              name="renter"
              onSearch={searchRenters}
              onSelect={onSelect}
              onAddNew={() => setCreateRenterOpen(true)}
              addNewLabel="+ Add new renter"
              placeholder="Search by name or email..."
              value={renterId || null}
              displayValue={renterLabel || null}
            />
          </Column>
          <Row className="rent-wizard-nav">
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="primary" disabled={!renterId} onClick={onNext}>
              Next
            </Button>
          </Row>
        </Column>
      </Backdrop>
      <CreateRenterDialog
        open={createRenterOpen}
        onOpenChange={setCreateRenterOpen}
        onRenterCreated={(item) => {
          onSelect(item);
          setCreateRenterOpen(false);
        }}
      />
    </>
  );
}

function CreateRenterDialog({
  open,
  onOpenChange,
  onRenterCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRenterCreated: (item: SearchSelectItem) => void;
}) {
  const { add: addToast } = Toast.useToastManager();
  const [name, setName] = useState("");
  const [questId, setQuestId] = useState("");
  const [email, setEmail] = useState("");

  const { mutate: createRenter, isPending } = useMutation({
    mutationFn: sendCreateRenterRequest,
    onSuccess: (res) => {
      const renter = res.data[0];
      addToast({ title: `${renter.name} successfully created` });
      onRenterCreated({
        label: `${renter.name} (${renter.email})`,
        value: renter.id,
      });
    },
    onError: (e) => {
      console.error(e);
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRenter({ name, questId, email });
  };

  return (
    <Dialog title="Add new renter" open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <Column className="new-renter-form">
          <Column className="form-field">
            <label htmlFor="new-renter-name">Name</label>
            <input
              id="new-renter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Column>
          <Column className="form-field">
            <label htmlFor="new-renter-quest-id">Quest ID</label>
            <input
              id="new-renter-quest-id"
              type="text"
              value={questId}
              onChange={(e) => setQuestId(e.target.value)}
              required
            />
          </Column>
          <Column className="form-field">
            <label htmlFor="new-renter-email">Email</label>
            <input
              id="new-renter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Column>
          <Button variant="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create renter"}
          </Button>
        </Column>
      </form>
    </Dialog>
  );
}
