import { createTRPCRouter } from "../init";
import { activitiesRouter } from "./activities";
import { hallOfFameRouter } from "./hall-of-fame";
import { homeRouter } from "./home";
import { executivesRouter } from "./executives";
import { galleryRouter } from "./gallery";

export const appRouter = createTRPCRouter({
  home: homeRouter,
  hallOfFame: hallOfFameRouter,
  activities: activitiesRouter,
  executives: executivesRouter,
  gallery: galleryRouter,
});

export type AppRouter = typeof appRouter;
