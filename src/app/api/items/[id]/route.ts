import { NextRequest, NextResponse } from "next/server";
import { workerFetch } from "../../util";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const res = await workerFetch(`/api/items/${id}`);

  return new NextResponse(res.body, { status: res.status });
}
