import { Schema, model, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  user: Schema.Types.ObjectId; // Reference to the User who owns the event
  title: string;
  description?: string;
  start: Date;
  end: Date;
  
  // --- Google Calendar Sync Fields ---
  googleCalendarId?: string; // ID of the Google Calendar this event belongs to (e.g., 'primary')
  googleEventId?: string;    // The unique ID from the Google Calendar event
  lastGoogleSync?: Date;     // Timestamp of the last sync with Google Calendar

  // --- Fields for Recurring Events ---
  isRecurring: boolean;
  recurrenceRule?: string;   // The RRULE string (e.g., 'FREQ=WEEKLY;BYDAY=MO')
  exceptionDates?: Date[];   // Dates when a recurring event instance is cancelled or changed
  parentId?: Schema.Types.ObjectId; // Links a modified instance to its recurring parent
}

const eventSchema = new Schema<IEvent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { 
    type: Date, 
    required: true,
    // Basic validation to ensure end date is after start date
    validate: {
      validator: function(this: IEvent, value: Date): boolean {
        return this.start < value;
      },
      message: 'Event end time must be after its start time.'
    }
  },

  // --- Google Calendar Sync Fields ---
  googleCalendarId: { type: String },
  googleEventId: { type: String, unique: true, sparse: true }, // Can be null, but if it exists, it must be unique
  lastGoogleSync: { type: Date },

  // --- Fields for Recurring Events ---
  isRecurring: { type: Boolean, default: false },
  recurrenceRule: { type: String },
  exceptionDates: [{ type: Date }],
  parentId: { type: Schema.Types.ObjectId, ref: 'Event' }, // Self-referencing for exceptions
}, { timestamps: true });

// --- Middleware for Overlap Validation ---
// This hook runs before a document is saved (`.save()` or `.create()`).
eventSchema.pre<IEvent>('save', async function(next) {
  // We only validate non-recurring events to avoid the complexity of parsing RRULEs.
  // The validation also runs for modified instances of recurring events (which have a parentId).
  if (this.isRecurring) {
    return next();
  }

  // Find other events for the same user that are not this exact document
  const existingEvent = await (this.constructor as Model<IEvent>).findOne({
    user: this.user,
    _id: { $ne: this._id }, // Exclude the document itself during an update
    // The core overlap condition:
    // An overlap exists if an event starts before the new one ends, AND ends after the new one starts.
    start: { $lt: this.end },
    end: { $gt: this.start },
  });

  if (existingEvent) {
    // If a conflicting event is found, stop the save and send an error.
    const err = new Error('Event time conflicts with an existing event.');
    return next(err);
  }

  next();
});

export const Event = model<IEvent>('Event', eventSchema);