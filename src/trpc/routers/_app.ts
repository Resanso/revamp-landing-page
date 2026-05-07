import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { hallOfFameRouter } from "./hallOfFame";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  hallOfFame: hallOfFameRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
