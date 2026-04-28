"use client";

import { Button } from "@/app/components/button/button.client";
import { Dialog } from "@/app/components/dialog/dialog.client";
import { Column, Row } from "@/app/components/layout/layout-components";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpandedCopy } from "../../util/worker-requests/copies";
import { sendModifyRentalRequest } from "../../util/worker-requests/rentals";
import "./return-confirm-dialog.scss";

export function ReturnConfirmDialog({
  copy,
  open,
  onOpenChange,
}: {
  copy: ExpandedCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { add: addToast } = Toast.useToastManager();
  const queryClient = useQueryClient();
  const rental = copy.rental!;

  const { mutate: returnRental, isPending } = useMutation({
    mutationFn: sendModifyRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      addToast({ title: "Item successfully returned" });
      onOpenChange(false);
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleConfirm = () => {
    returnRental({
      id: rental.id,
      copy_id: rental.copyId,
      renter_id: rental.renterId,
      renting_club_id: rental.rentingClubId ?? undefined,
      checkout_date: rental.checkoutDate,
      due_date: rental.dueDate,
      date_returned: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Dialog
      title="Return item"
      open={open}
      onOpenChange={onOpenChange}
      className="return-confirm-dialog"
    >
      <Column className="return-confirm-dialog-col">
        <Column className="return-confirm-details">
          <span>{copy.item?.name}</span>
          <span className="return-confirm-secondary">{copy.barcode}</span>
          <span>
            Rented by{" "}
            <span className="return-confirm-highlight">
              {copy.renter?.name}
            </span>
            {copy.renter?.questId ? ` (${copy.renter.questId})` : null}
          </span>
          <span>
            Checked out:{" "}
            <span className="return-confirm-highlight">
              {rental.checkoutDate}
            </span>
          </span>
          <span>
            Due:{" "}
            <span className="return-confirm-highlight">{rental.dueDate}</span>
          </span>
        </Column>
        <Row className="return-confirm-actions">
          <Button onClick={() => onOpenChange(false)}>Do not return</Button>
          <Button
            variant="primary"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Returning..." : "Confirm return"}
          </Button>
        </Row>
      </Column>
    </Dialog>
  );
}
