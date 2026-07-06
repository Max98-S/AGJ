import { createServerFn } from "@tanstack/react-start";

import { getBandiNewsData, type BandiNews } from "../bandi.server";

// Aggregates the latest funding/bandi news server-side and returns them to the
// client. Cached server-side (see bandi.server.ts) so it stays fast and fresh.
export const getBandiNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<BandiNews> => {
    return getBandiNewsData();
  },
);
