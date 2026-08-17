import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null
    },
    waterQuantity: { type: Number, required: true, min: 1 },
    deliveryDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI"],
      default: "UPI"
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "On the Way", "Delivered", "Cancelled"],
      default: "Pending"
    },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
