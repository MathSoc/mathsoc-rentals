export const workerFetch = async (route: string, options?: RequestInit) => {
  if (!process.env.WORKER_URL) {
    throw new Error("WORKER_URL unset");
  }

  const headers = new Headers(options?.headers);
  headers.set("X-API-KEY", process.env.WORKER_API_KEY!);

  return await fetch(new URL(route, process.env.WORKER_URL), {
    ...options,
    headers,
  });
};
