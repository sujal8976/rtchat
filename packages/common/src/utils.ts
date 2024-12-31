import { z } from "zod";

export const formatZodErrors = (errors: z.ZodIssue[]) => {
  return errors
    .map((err) => {
      // Join the path and replace underscores with spaces
      const field = err.path.join(".").replace(/_/g, " ");
      // Capitalize the first letter of the field
      const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
      const message = err.message;
      return `• ${formattedField}: ${message}`;
    })
    .join("\n");
};
