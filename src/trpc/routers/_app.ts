import { createTRPCRouter } from "../init";
import { activitiesRouter } from "./activities";
import { hallOfFameRouter } from "./hall-of-fame";
import { homeRouter } from "./home";

export const appRouter = createTRPCRouter({
  home: homeRouter,
  hallOfFame: hallOfFameRouter,
  activities: activitiesRouter,
});

export type AppRouter = typeof appRouter;
