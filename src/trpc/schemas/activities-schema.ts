import { z } from "zod";

export const activityCategoryEnum = z.string().min(1);

export const activityGetAllSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(9),
});

export const activityGetBySlugSchema = z.object({
  slug: z.string(),
});

export const activityGetLatestByCategorySchema = z.object({
  limit: z.number().int().min(1).default(3),
});

export const activityGetByIdSchema = z.object({
  id: z.string(),
});

export const activityCreateSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: activityCategoryEnum,
  coverImage: z.string().min(1),
  contentMarkdown: z.string(),
});

export const activityUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: activityCategoryEnum,
  coverImage: z.string().min(1),
  contentMarkdown: z.string(),
});

export const activityDeleteSchema = z.object({
  id: z.string(),
});
