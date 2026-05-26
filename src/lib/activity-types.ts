export type ActivityCategory = string;

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
