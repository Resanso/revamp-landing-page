import "server-only";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: async () => createTRPCContext({ headers: await headers() }),
  router: appRouter,
  queryClient: getQueryClient,
});

// Direct server-side caller — use in Server Components for simple data fetching
export const getCaller = cache(async () => {
  const ctx = await createTRPCContext({ headers: await headers() });
  return createCallerFactory(appRouter)(ctx);
});
