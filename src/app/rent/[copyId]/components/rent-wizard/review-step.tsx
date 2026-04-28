"use client";

import { Button } from "@/app/components/button/button.client";
import { Backdrop } from "@/app/components/backdrop/backdrop";
import { Column, Row } from "@/app/components/layout/layout-components";
import "./review-step.scss";

export function ReviewStep({
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
          {checkoutDate ? (
            <Row className="rent-wizard-review-row">
              <span className="rent-wizard-review-label">Checkout date</span>
              <span>{checkoutDate}</span>
            </Row>
          ) : null}
          <Row className="rent-wizard-review-row">
            <span className="rent-wizard-review-label">Due date</span>
            <span>{dueDate}</span>
          </Row>
          {rentingClubName ? (
            <Row className="rent-wizard-review-row">
              <span className="rent-wizard-review-label">Renting club</span>
              <span>{rentingClubName}</span>
            </Row>
          ) : null}
        </Column>
        <Row className="rent-wizard-nav">
          <Button disabled={isPending} onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" disabled={isPending} onClick={onSubmit}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </Row>
      </Column>
    </Backdrop>
  );
}
