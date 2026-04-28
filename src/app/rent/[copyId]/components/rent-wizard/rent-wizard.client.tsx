"use client";

import { Button } from "@/app/components/button/button.client";
import { Backdrop } from "@/app/components/backdrop/backdrop";
import { Column, Row } from "@/app/components/layout/layout-components";
import { Page } from "@/app/components/page/page-component";
import {
  SearchSelect,
  SearchSelectItem,
} from "@/app/components/search-select/search-select.client";
import { Stepper } from "@/app/components/stepper/stepper";
import { sendCreateRentalRequest } from "@/app/util/worker-requests/rentals";
import { searchRenters } from "@/app/util/worker-requests/renters";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./rent-wizard.scss";

type ClubOption = { id: string; name: string };
type ClubsResponse = { data: ClubOption[] };

export function RentWizard({
  copyId,
  itemName,
  barcode,
}: {
  copyId: string;
  itemName: string;
  barcode: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [renterId, setRenterId] = useState("");
  const [renterLabel, setRenterLabel] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [rentingClubId, setRentingClubId] = useState("");
  const [rentingClubName, setRentingClubName] = useState("");

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
      router.push("/");
    },
    onError: () => {
      addToast({ title: "Something went wrong. Please try again." });
    },
  });

  const handleRenterSelect = (item: SearchSelectItem | null) => {
    setRenterId(item?.value ?? "");
    setRenterLabel(item?.label ?? "");
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setRentingClubId(id);
    const club = clubsData?.data.find((c) => c.id === id);
    setRentingClubName(club?.name ?? "");
  };

  const handleSubmit = () => {
    createRental({
      copy_id: copyId,
      renter_id: renterId,
      renting_club_id: rentingClubId || undefined,
      checkout_date: checkoutDate || undefined,
      due_date: dueDate,
    });
  };

  return (
    <Page id="rent-wizard-page" wide={false}>
      <Column className="rent-wizard">
        <Row className="rent-wizard-header">
          <h1>Rent item</h1>
        </Row>
        <Stepper steps={["Renter", "Details", "Review"]} currentStep={step} />

        {step === 1 ? (
          <SelectRenterStep
            renterId={renterId}
            renterLabel={renterLabel}
            onSelect={handleRenterSelect}
            onNext={() => setStep(2)}
            onCancel={() => router.push("/")}
          />
        ) : null}

        {step === 2 ? (
          <RentalDetailsStep
            dueDate={dueDate}
            checkoutDate={checkoutDate}
            rentingClubId={rentingClubId}
            clubs={clubsData?.data ?? []}
            onDueDateChange={setDueDate}
            onCheckoutDateChange={setCheckoutDate}
            onClubChange={handleClubChange}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        ) : null}

        {step === 3 ? (
          <ReviewStep
            itemName={itemName}
            barcode={barcode}
            renterLabel={renterLabel}
            dueDate={dueDate}
            checkoutDate={checkoutDate}
            rentingClubName={rentingClubName}
            isPending={isPending}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        ) : null}
      </Column>
    </Page>
  );
}

function SelectRenterStep({
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
  return (
    <Backdrop>
      <Column className="rent-wizard-step">
        <h2>Select a renter</h2>
        <Column className="form-field">
          <label>Renter</label>
          <SearchSelect
            name="renter"
            onSearch={searchRenters}
            onSelect={onSelect}
            placeholder="Search by name or email..."
            value={renterId || null}
            displayValue={renterLabel || null}
          />
        </Column>
        <Row className="rent-wizard-nav">
          <Button variant="white" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="pink" disabled={!renterId} onClick={onNext}>
            Next
          </Button>
        </Row>
      </Column>
    </Backdrop>
  );
}

function RentalDetailsStep({
  dueDate,
  checkoutDate,
  rentingClubId,
  clubs,
  onDueDateChange,
  onCheckoutDateChange,
  onClubChange,
  onBack,
  onNext,
}: {
  dueDate: string;
  checkoutDate: string;
  rentingClubId: string;
  clubs: ClubOption[];
  onDueDateChange: (v: string) => void;
  onCheckoutDateChange: (v: string) => void;
  onClubChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Backdrop>
      <Column className="rent-wizard-step">
        <h2>Rental details</h2>
        <Column className="form-field">
          <label htmlFor="wizard-due-date">Due date</label>
          <input
            id="wizard-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            required
          />
        </Column>
        <Column className="form-field">
          <label htmlFor="wizard-checkout-date">Checkout date (optional)</label>
          <input
            id="wizard-checkout-date"
            type="date"
            value={checkoutDate}
            onChange={(e) => onCheckoutDateChange(e.target.value)}
          />
        </Column>
        <Column className="form-field">
          <label htmlFor="wizard-club">Renting club (optional)</label>
          <select id="wizard-club" value={rentingClubId} onChange={onClubChange}>
            <option value="">None</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </Column>
        <Row className="rent-wizard-nav">
          <Button variant="white" onClick={onBack}>
            Back
          </Button>
          <Button variant="pink" disabled={!dueDate} onClick={onNext}>
            Next
          </Button>
        </Row>
      </Column>
    </Backdrop>
  );
}

function ReviewStep({
  itemName,
  barcode,
  renterLabel,
  dueDate,
  checkoutDate,
  rentingClubName,
  isPending,
  onBack,
  onSubmit,
}: {
  itemName: string;
  barcode: string;
  renterLabel: string;
  dueDate: string;
  checkoutDate: string;
  rentingClubName: string;
  isPending: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <Backdrop>
      <Column className="rent-wizard-step">
        <h2>Review</h2>
        <Column className="rent-wizard-review">
          <Row className="rent-wizard-review-row">
            <span className="rent-wizard-review-label">Item</span>
            <span>{itemName || "—"}</span>
          </Row>
          <Row className="rent-wizard-review-row">
            <span className="rent-wizard-review-label">Barcode</span>
            <span>{barcode || "—"}</span>
          </Row>
          <Row className="rent-wizard-review-row">
            <span className="rent-wizard-review-label">Renter</span>
            <span>{renterLabel}</span>
          </Row>
          <Row className="rent-wizard-review-row">
            <span className="rent-wizard-review-label">Due date</span>
            <span>{dueDate}</span>
          </Row>
          {checkoutDate ? (
            <Row className="rent-wizard-review-row">
              <span className="rent-wizard-review-label">Checkout date</span>
              <span>{checkoutDate}</span>
            </Row>
          ) : null}
          {rentingClubName ? (
            <Row className="rent-wizard-review-row">
              <span className="rent-wizard-review-label">Renting club</span>
              <span>{rentingClubName}</span>
            </Row>
          ) : null}
        </Column>
        <Row className="rent-wizard-nav">
          <Button variant="white" disabled={isPending} onClick={onBack}>
            Back
          </Button>
          <Button variant="pink" disabled={isPending} onClick={onSubmit}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </Row>
      </Column>
    </Backdrop>
  );
}
