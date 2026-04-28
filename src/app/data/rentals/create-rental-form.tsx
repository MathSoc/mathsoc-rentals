"use client";

import { Button } from "@/app/components/button/button.client";
import { DrawerForm } from "@/app/components/drawer/drawer-form/drawer-form";
import { Column } from "@/app/components/layout/layout-components";
import { sendCreateRentalRequest } from "@/app/util/worker-requests/rentals";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type CreateRentalFormProps = {
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

export const CreateRentalForm: React.FC<CreateRentalFormProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [copyId, setCopyId] = useState("");
  const [renterId, setRenterId] = useState("");
  const [rentingClubId, setRentingClubId] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [dueDate, setDueDate] = useState("");

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

  const { mutate: createRental, isPending } = useMutation({
    mutationFn: sendCreateRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      addToast({ title: "Rental successfully created" });
      onSuccess();
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createRental({
      copy_id: copyId,
      renter_id: renterId,
      renting_club_id: rentingClubId || undefined,
      checkout_date: checkoutDate || undefined,
      due_date: dueDate,
    });
  };

  return (
    <DrawerForm className="create-rental-form" onSubmit={handleSubmit}>
      <Column className="form-field">
        <label htmlFor="rental-copy-id">Copy</label>
        <select
          id="rental-copy-id"
          value={copyId}
          onChange={(e) => setCopyId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a copy
          </option>
          {copiesData?.data.map((copy) => (
            <option key={copy.id} value={copy.id}>
              Copy #{copy.copyNumber} ({copy.itemId})
            </option>
          ))}
        </select>
      </Column>

      <Column className="form-field">
        <label htmlFor="rental-renter-id">Renter</label>
        <select
          id="rental-renter-id"
          value={renterId}
          onChange={(e) => setRenterId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a renter
          </option>
          {rentersData?.data.map((renter) => (
            <option key={renter.id} value={renter.id}>
              {renter.name} ({renter.email})
            </option>
          ))}
        </select>
      </Column>

      <Column className="form-field">
        <label htmlFor="rental-renting-club-id">Renting club</label>
        <select
          id="rental-renting-club-id"
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
        <label htmlFor="rental-checkout-date">Checkout date</label>
        <input
          id="rental-checkout-date"
          type="date"
          value={checkoutDate}
          onChange={(e) => setCheckoutDate(e.target.value)}
        />
      </Column>

      <Column className="form-field">
        <label htmlFor="rental-due-date">Due date</label>
        <input
          id="rental-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </Column>

      <Button variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create rental"}
      </Button>
    </DrawerForm>
  );
};
