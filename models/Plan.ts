import mongoose, { Schema } from "mongoose";


const planSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    features: [{ type: String, required: true }],
    duration: { type: Number, required: true, min: 1 }, // days
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model("Plan", planSchema);
