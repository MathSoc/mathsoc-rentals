import path from "path";

export const workerFetch = async (route: string) => {
  if (!process.env.WORKER_URL) {
    throw new Error("WORKER_URL unset");
  }

  return await fetch(path.join(process.env.WORKER_URL, route));
};
