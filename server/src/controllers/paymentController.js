import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

export async function getPayments(req, res) {
  try {
    const payments = await Payment.find()
      .populate("customer")
      .populate("booking")
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createPayment(req, res) {
  try {
    const { bookingId, amount, method, status, reference } = req.body;

    if (!bookingId || amount === undefined || !method) {
      return res.status(400).json({ message: "Booking, amount and method are required." });
    }

    const booking = await Booking.findById(bookingId).populate("customer");
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer._id,
      amount: Number(amount),
      method,
      status: status || "Paid",
      reference: reference || ""
    });

    const populated = await Payment.findById(payment._id)
      .populate("customer")
      .populate("booking");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
