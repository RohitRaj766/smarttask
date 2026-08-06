import { Document } from "mongoose";

export interface IUserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  tokenVersion: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
