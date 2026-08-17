import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["Cash", "UPI"],
      required: true
    },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid"
    },
    reference: { type: String, default: "" },
    paymentDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
