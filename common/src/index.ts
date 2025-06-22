import { z } from "zod";

export const signUpInput = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
});

export const signInInput = z.object({
  email: z.string().email(),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const changeBlogInput = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export type SignUpType = z.infer<typeof signUpInput>;
export type signInType = z.infer<typeof signInInput>;
export type createBlogType = z.infer<typeof createBlogInput>;
export type changeBlogType = z.infer<typeof changeBlogInput>;
