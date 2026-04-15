"use client";

import { Button } from "../../button/button.client";
import { Column } from "../../layout/layout-components";
import { Dialog } from "../dialog.client";
import "./delete-dialog.scss";

export function DeleteDialog({
  title,
  open,
  setOpen,
  onDeleteConfirm,
}: {
  title: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Delete club">
      <p>Are you sure you want to delete &quot;{title}&quot;?</p>
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
