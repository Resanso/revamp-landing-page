import { createTRPCRouter } from "../init";
import { activitiesRouter } from "./activities";
import { competitionRouter } from "./competition";
import { contentCategoriesRouter } from "./content-categories";
import { hallOfFameRouter } from "./hall-of-fame";
import { homeRouter } from "./home";

export const appRouter = createTRPCRouter({
  home: homeRouter,
  hallOfFame: hallOfFameRouter,
  activities: activitiesRouter,
  contentCategories: contentCategoriesRouter,
  competition: competitionRouter,
});

export type AppRouter = typeof appRouter;
