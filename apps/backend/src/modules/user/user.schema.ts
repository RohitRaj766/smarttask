import { Schema, model } from "mongoose";
import { IUserDocument } from "./user.types.js";

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    tokenVersion: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>("User", userSchema);
