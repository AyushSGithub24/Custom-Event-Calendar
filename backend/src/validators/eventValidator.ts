import { z } from "zod";

// Schema for POST (create)
export const eventSchema = z.object({
  title: z.string().min(1),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
  description: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: "Event end time must be after its start time",
  path: ["end"],
});

// Schema for PUT (update)
export const updateEventSchema = eventSchema.partial().refine((data) => {
  if (data.start && data.end) {
    return new Date(data.end) > new Date(data.start);
  }
  return true; // skip check if one is missing
}, {
  message: "Event end time must be after its start time",
  path: ["end"],
});
