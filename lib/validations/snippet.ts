import * as z from "zod";

export const snippetFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  language: z.string().min(1, "Please select a language"),
  code: z.string().min(1, "Code is required"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^[\w/.-]+$/, {
      message:
        "Invalid path format. Use only letters, numbers, underscores, hyphens, and forward slashes",
    }),
});

export type SnippetFormData = z.infer<typeof snippetFormSchema>;
