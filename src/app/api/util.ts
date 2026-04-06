import path from "path";

export const workerFetch = async (route: string, options?: RequestInit) => {
  if (!process.env.WORKER_URL) {
    throw new Error("WORKER_URL unset");
  }

  const headers = new Headers(options?.headers);
  headers.set("X-API-KEY", process.env.API_KEY!);

  return await fetch(path.join(process.env.WORKER_URL, route), {
    ...options,
    headers,
  });
};
