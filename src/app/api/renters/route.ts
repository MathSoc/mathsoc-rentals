import { NextRequest, NextResponse } from "next/server";
import { workerFetch } from "../util";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  const res = await workerFetch(`/api/renters${query}`);

  return new NextResponse(res.body, { status: res.status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/renters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/renters", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const res = await workerFetch("/api/renters", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(res.body, { status: res.status });
}
