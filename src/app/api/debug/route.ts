import { NextResponse } from "next/server";
import { workerFetch } from "../util";

/**
 * Returns an exam found at the provided route
 */
export async function GET(): Promise<NextResponse> {
  // @todo auth protection
  const res = await workerFetch("/api/items");

  return new NextResponse(res.body, {
    status: 200,
  });
}
