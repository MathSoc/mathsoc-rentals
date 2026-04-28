"use client";

import { Column, Row } from "@/app/components/layout/layout-components";
import { Page } from "@/app/components/page/page-component";
import { SearchSelectItem } from "@/app/components/search-select/search-select.client";
import { Stepper } from "@/app/components/stepper/stepper";
import { sendCreateRentalRequest } from "@/app/util/worker-requests/rentals";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClubOption, RentalDetailsStep } from "./rental-details-step";
import { ReviewStep } from "./review-step";
import { SelectRenterStep } from "./select-renter-step";
import "./rent-wizard.scss";

type ClubsResponse = { data: ClubOption[] };

export function RentWizard({
  copyId,
  itemName,
  barcode,
  physicalLocation,
}: {
  copyId: string;
  itemName: string;
  barcode: string;
  physicalLocation: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { add: addToast } = Toast.useToastManager();

  const today = new Date().toISOString().split("T")[0];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [renterId, setRenterId] = useState("");
  const [renterLabel, setRenterLabel] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState(today);
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
            itemName={itemName}
            barcode={barcode}
            physicalLocation={physicalLocation}
            renterLabel={renterLabel}
            dueDate={dueDate}
            checkoutDate={checkoutDate}
            rentingClubId={rentingClubId}
            clubs={clubsData?.data ?? []}
            minDate={today}
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
