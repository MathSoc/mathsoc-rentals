import { RentWizard } from "./components/rent-wizard/rent-wizard.client";

export default async function RentPage({
  params,
  searchParams,
}: {
  params: Promise<{ copyId: string }>;
  searchParams: Promise<{ item?: string; barcode?: string; location?: string }>;
}) {
  const { copyId } = await params;
  const { item, barcode, location } = await searchParams;

  return (
    <RentWizard
      copyId={copyId}
      itemName={item ?? ""}
      barcode={barcode ?? ""}
      physicalLocation={location ?? ""}
    />
  );
}
