import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    tankerNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Available", "On Delivery", "Offline"],
      default: "Available"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
