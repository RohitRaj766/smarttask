import { Schema, model, Document, Types } from "mongoose";

export interface IPasswordResetDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<IPasswordResetDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PasswordResetModel = model<IPasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema,
  "password_resets"
);
