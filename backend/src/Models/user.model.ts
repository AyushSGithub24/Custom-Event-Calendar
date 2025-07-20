import { Schema, model, Document } from 'mongoose';

// Define the interface for your user document
export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);