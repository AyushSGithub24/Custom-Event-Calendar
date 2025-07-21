import { Router, Request, Response } from "express";
import { Event } from "../Models/event.model";
import { User } from "../Models/user.model";
import { eventSchema, updateEventSchema } from "../validators/eventValidator";

const eventRouter = Router();

// Middleware to get authenticated user
async function getUserFromSession(req: Request) {
  if (!req.session.userId) return null;
  const user = await User.findById(req.session.userId);
  return user;
}

// GET all events for the authenticated user
eventRouter.get("/", async (req: Request, res: Response) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const now = new Date();

    // Fetch only future events
     const futureEvents = await Event.find({
      user: user._id,
      end: { $gte: now },
    }).sort({ start: 1 }); // 1 = ascending, -1 = descending

    res.status(200).json(futureEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST: Create a new event
eventRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const parsed = eventSchema.parse(req.body); // will throw if invalid

    const event = new Event({
      ...parsed,
      user: user._id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error  || "Failed to create event" });
  }
});

// PUT: Update an event
eventRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Validate with Zod
    const parsed = updateEventSchema.parse(req.body);

    // Convert to Date
    // @ts-ignore
    if (parsed.start) parsed.start = new Date(parsed.start);
    // @ts-ignore
    if (parsed.end) parsed.end = new Date(parsed.end);

    // Fetch and update the document manually
    const event = await Event.findOne({ _id: req.params.id, user: user._id });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if(event.isRecurring){
      res.status(400).json({ error: "Cannot update recurring events directly" });
      return;
    }

    Object.assign(event, parsed); // Merge updated fields
    const updatedEvent = await event.save(); // Triggers schema validation properly

    res.status(200).json(updatedEvent);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    console.log
    return res.status(400).json({ error: error.message || "Failed to update event" });
  }
});


// DELETE: Remove an event
eventRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ error: "Event not found or not authorized" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default eventRouter;
