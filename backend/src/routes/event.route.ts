import { Router } from "express";
import { createEvent, deleteEvent, getUpcomingEvents, getUserFromSession, updateEvent } from "../controllers/event.controller";

const eventRouter = Router();

// GET all events for the authenticated user
eventRouter.get("/", getUpcomingEvents);

// POST: Create a new event
eventRouter.post("/", createEvent);

// PUT: Update an event
eventRouter.put("/:id", updateEvent);


// DELETE: Remove an event
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
