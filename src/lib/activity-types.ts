export const ACTIVITY_CATEGORIES = ["Event", "Information", "Articles"] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export type ActivityMeta = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: ActivityCategory;
  excerpt: string;
  coverImage: string;
};

export type ActivityPost = ActivityMeta & {
  contentHtml: string;
};
