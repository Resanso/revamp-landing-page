import { initTRPC } from '@trpc/server';
import { handlePrismaError } from '@/trpc/utils/prismaErrorHandlers';
 
/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // const user = await auth(opts.headers);
  return { userId: 'user_123' };
};
 
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    // transformer: superjson,
  });
 
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const prismaErrorHandlerMiddleware = t.middleware(async ({ next, path, rawInput }) => {
  try {
    return await next();
  } catch (error) {
    const entity = path.split(".")[0];
    let id: number | undefined = undefined;
    if (rawInput && typeof rawInput === "object" && "id" in rawInput) {
      id = (rawInput as any).id;
    }
    handlePrismaError(error, { entity, id });
  }
});

export const baseProcedure = t.procedure.use(prismaErrorHandlerMiddleware);