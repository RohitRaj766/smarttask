import { Document, Types } from "mongoose";

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  tokenVersion: number;
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
