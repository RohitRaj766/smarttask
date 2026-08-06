import { Schema, model, Document, Types } from "mongoose";

export interface IEmailVerificationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emailVerificationSchema = new Schema<IEmailVerificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const EmailVerificationModel = model<IEmailVerificationDocument>(
  "EmailVerification",
  emailVerificationSchema,
  "email_verifications"
);
