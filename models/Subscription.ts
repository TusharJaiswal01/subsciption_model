import mongoose, { Schema } from "mongoose";
import { SubscriptionStatus } from "../types";

const subscriptionSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    planId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
