import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start: z.coerce.date(),  // Automatically convert string to Date
  end: z.coerce.date(),
  isRecurring: z.boolean().optional().default(false),
  recurrenceRule: z.string().optional(),
  exceptionDates: z.array(z.coerce.date()).optional(),
  parentId: z.string().optional(),
  googleCalendarId: z.string().optional(),
  googleEventId: z.string().optional(),
});
