import mongoose, { Document, Schema } from "mongoose";
import { generateUniqueCode } from "../utils/uuid";

interface VerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
}

const verificationSchema = new Schema<VerificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      default: generateUniqueCode,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationModel = mongoose.model<VerificationDocument>(
  "Verification",
  verificationSchema
);

export default VerificationModel;
