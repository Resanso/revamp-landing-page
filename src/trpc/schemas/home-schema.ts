import { z } from "zod";

export const upsertHeroSlideSchema = z.object({
  id: z.string().optional(),
  src: z.string().min(1),
  alt: z.string().min(1),
  order: z.number().int(),
});

export const deleteHeroSlideSchema = z.object({
  id: z.string(),
});

export const updateSuccessStatSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  value: z.string().min(1),
  accent: z.enum(["black", "primary"]),
});

export const upsertDepartmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  img: z.string().min(1),
  order: z.number().int(),
});
