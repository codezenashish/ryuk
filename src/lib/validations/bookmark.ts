import { z } from "zod";

export const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL (e.g. https://example.com)"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  favicon: z.string().optional().or(z.literal("")),
});

export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be 50 characters or less"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please select a valid hex color")
    .default("#6366F1"),
  icon: z.string().default("RiFolder5Line"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
