import { NextRequest, NextResponse } from "next/server";
import { workerFetch } from "../util";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const params = new URLSearchParams();

  const pageIndex = searchParams.get("page_index");
  const pageSize = searchParams.get("page_size");
  if (pageIndex !== null) params.set("page_index", pageIndex);
  if (pageSize !== null) params.set("page_size", pageSize);

  const query = params.size > 0 ? `?${params.toString()}` : "";
  const res = await workerFetch(`/api/rentals${query}`);

  return new NextResponse(res.body, { status: res.status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/rentals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/rentals", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/rentals", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}
