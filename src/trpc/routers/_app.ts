import { createTRPCRouter } from "../init";
import { activitiesRouter } from "./activities";
import { contentCategoriesRouter } from "./content-categories";
import { hallOfFameRouter } from "./hall-of-fame";
import { homeRouter } from "./home";
import { executivesRouter } from "./executives";
import { galleryRouter } from "./gallery";
import { competitionRouter } from "./competition";

export const appRouter = createTRPCRouter({
  home: homeRouter,
  hallOfFame: hallOfFameRouter,
  activities: activitiesRouter,
  executives: executivesRouter,
  gallery: galleryRouter,
  contentCategories: contentCategoriesRouter,
  competition: competitionRouter,
});

export type AppRouter = typeof appRouter;
