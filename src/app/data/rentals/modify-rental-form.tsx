"use client";

import { Button } from "@/app/components/button/button.client";
import { DeleteDialog } from "@/app/components/dialog/delete-dialog/delete-dialog";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { Rental } from "@/app/util/types";
import {
  sendDeleteRentalRequest,
  sendModifyRentalRequest,
} from "@/app/util/worker-requests/rentals";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModifyRentalFormProps = {
  rental: Rental;
  onSuccess: () => void;
};

type CopyOption = {
  id: string;
  copyNumber: number;
  itemId: string;
};

type CopiesResponse = {
  data: CopyOption[];
};

type RenterOption = {
  id: string;
  name: string;
  email: string;
};

type RentersResponse = {
  data: RenterOption[];
};

type ClubOption = {
  id: string;
  name: string;
};

type ClubsResponse = {
  data: ClubOption[];
};

export const ModifyRentalForm: React.FC<ModifyRentalFormProps> = ({
  rental,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [copyId, setCopyId] = useState(rental.copyId);
  const [renterId, setRenterId] = useState(rental.renterId);
  const [rentingClubId, setRentingClubId] = useState(
    rental.rentingClubId ?? "",
  );
  const [checkoutDate, setCheckoutDate] = useState(rental.checkoutDate);
  const [dueDate, setDueDate] = useState(rental.dueDate);
  const [dateReturned, setDateReturned] = useState(rental.dateReturned ?? "");
  const [cancelledAt, setCancelledAt] = useState(rental.cancelledAt ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: copiesData } = useQuery<CopiesResponse>({
    queryKey: ["copies"],
    queryFn: async () => {
      const res = await fetch("/api/copies?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch copies");
      return res.json();
    },
  });

  const { data: rentersData } = useQuery<RentersResponse>({
    queryKey: ["renters"],
    queryFn: async () => {
      const res = await fetch("/api/renters?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch renters");
      return res.json();
    },
  });

  const { data: clubsData } = useQuery<ClubsResponse>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await fetch("/api/clubs?page_size=100");
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  const { mutate: modifyRental, isPending: isModificationPending } =
    useMutation({
      mutationFn: sendModifyRentalRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rentals"] });
        addToast({ title: "Rental successfully updated" });
        onSuccess();
      },
      onError: () => {
        addToast({ title: "Something went wrong. Please try again." });
      },
    });

  const { mutate: deleteRental, isPending: isDeletionPending } = useMutation({
    mutationFn: sendDeleteRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      addToast({ title: "Rental successfully deleted" });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Failed to delete rental. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    modifyRental({
      id: rental.id,
      copy_id: copyId,
      renter_id: renterId,
      renting_club_id: rentingClubId || undefined,
      checkout_date: checkoutDate || undefined,
      due_date: dueDate,
      date_returned: dateReturned || undefined,
      cancelled_at: cancelledAt || undefined,
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteRental(rental.id);
  };

  const isPending = isModificationPending || isDeletionPending;

  return (
    <div>
      <DrawerForm className="modify-rental-form" onSubmit={handleSubmit}>
        <Column className="form-field">
          <label htmlFor="modify-rental-copy-id">Copy</label>
          <select
            id="modify-rental-copy-id"
            value={copyId}
            onChange={(e) => setCopyId(e.target.value)}
            required
          >
            {copiesData?.data.map((copy) => (
              <option key={copy.id} value={copy.id}>
                Copy #{copy.copyNumber} ({copy.itemId})
              </option>
            ))}
          </select>
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-renter-id">Renter</label>
          <select
            id="modify-rental-renter-id"
            value={renterId}
            onChange={(e) => setRenterId(e.target.value)}
            required
          >
            {rentersData?.data.map((renter) => (
              <option key={renter.id} value={renter.id}>
                {renter.name} ({renter.email})
              </option>
            ))}
          </select>
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-renting-club-id">Renting club</label>
          <select
            id="modify-rental-renting-club-id"
            value={rentingClubId}
            onChange={(e) => setRentingClubId(e.target.value)}
          >
            <option value="">None</option>
            {clubsData?.data.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-checkout-date">Checkout date</label>
          <input
            id="modify-rental-checkout-date"
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-due-date">Due date</label>
          <input
            id="modify-rental-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-date-returned">Date returned</label>
          <input
            id="modify-rental-date-returned"
            type="date"
            value={dateReturned}
            onChange={(e) => setDateReturned(e.target.value)}
          />
        </Column>

        <Column className="form-field">
          <label htmlFor="modify-rental-cancelled-at">Cancelled at</label>
          <input
            id="modify-rental-cancelled-at"
            type="date"
            value={cancelledAt}
            onChange={(e) => setCancelledAt(e.target.value)}
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
            {isDeletionPending ? "Deleting..." : "Delete rental"}
          </Button>
        </Column>
      </DrawerForm>

      <DeleteDialog
        title={`Rental ${rental.id}`}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
