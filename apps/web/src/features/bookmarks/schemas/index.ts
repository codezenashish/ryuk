import { z } from "zod";

export const createBookmarkSchema = z.object({
  url: z.string().url("A valid URL is required"),
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
