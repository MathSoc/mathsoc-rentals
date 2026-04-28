"use client";

import { Button } from "@/app/components/button/button.client";
import { Backdrop } from "@/app/components/backdrop/backdrop";
import { Column, Row } from "@/app/components/layout/layout-components";
import "./rental-details-step.scss";

export type ClubOption = { id: string; name: string };

export function RentalDetailsStep({
  itemName,
  barcode,
  physicalLocation,
  renterLabel,
  dueDate,
  checkoutDate,
  rentingClubId,
  clubs,
  minDate,
  onDueDateChange,
  onCheckoutDateChange,
  onClubChange,
  onBack,
  onNext,
}: {
  itemName: string;
  barcode: string;
  physicalLocation: string;
  renterLabel: string;
  dueDate: string;
  checkoutDate: string;
  rentingClubId: string;
  clubs: ClubOption[];
  minDate: string;
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
        <Column className="rent-wizard-copy-details">
          <span>{itemName || "—"}</span>
          <span className="rent-wizard-copy-detail-secondary">{barcode}</span>
          {physicalLocation ? (
            <span className="rent-wizard-copy-detail-secondary">
              {physicalLocation}
            </span>
          ) : null}
        </Column>
        <Column className="rent-wizard-renter-details">
          <span className="rent-wizard-copy-detail-secondary">Renter</span>
          <span>{renterLabel}</span>
        </Column>
        <Column className="form-field">
          <label htmlFor="wizard-checkout-date">Checkout date</label>
          <input
            id="wizard-checkout-date"
            type="date"
            value={checkoutDate}
            min={minDate}
            onChange={(e) => onCheckoutDateChange(e.target.value)}
            required
          />
        </Column>
        <Column className="form-field">
          <label htmlFor="wizard-due-date">Due date</label>
          <input
            id="wizard-due-date"
            type="date"
            value={dueDate}
            min={minDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            required
          />
        </Column>
        <Column className="form-field">
          <label htmlFor="wizard-club">Renting club (optional)</label>
          <select
            id="wizard-club"
            value={rentingClubId}
            onChange={onClubChange}
          >
            <option value="">None</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </Column>
        <Row className="rent-wizard-nav">
          <Button onClick={onBack}>Back</Button>
          <Button
            variant="primary"
            disabled={!dueDate || !checkoutDate}
            onClick={onNext}
          >
            Next
          </Button>
        </Row>
      </Column>
    </Backdrop>
  );
}
