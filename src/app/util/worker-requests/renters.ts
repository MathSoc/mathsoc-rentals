type CreateRenterPayload = {
  name: string;
  questId: string;
};

type ModifyRenterPayload = {
  id: string;
  name: string;
  questId: string;
};

export async function sendCreateRenterRequest(payload: CreateRenterPayload) {
  const res = await fetch("/api/renters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to create renter");
  return res.json();
}

export async function sendModifyRenterRequest(payload: ModifyRenterPayload) {
  const res = await fetch("/api/renters", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
  if (!res.ok) throw new Error("Failed to update renter");
  return res.json();
}

export async function sendDeleteRenterRequest(id: string) {
  const res = await fetch("/api/renters", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });
  if (!res.ok) throw new Error("Failed to delete renter");
  return res.json();
}
