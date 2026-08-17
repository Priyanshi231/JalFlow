import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Driver from "../models/Driver.js";

function makeBookingId() {
  return `JF-${Date.now().toString().slice(-8)}`;
}

export async function getBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("customer")
      .populate("driver")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createBooking(req, res) {
  try {
    const {
      customerName,
      phone,
      address,
      waterQuantity,
      deliveryDate,
      timeSlot,
      paymentMethod,
      amount,
      notes
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !waterQuantity ||
      !deliveryDate ||
      !timeSlot ||
      amount === undefined
    ) {
      return res.status(400).json({ message: "Please fill all required booking fields." });
    }

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone,
        address
      });
    } else {
      customer.name = customerName;
      customer.address = address;
      await customer.save();
    }

    const booking = await Booking.create({
      bookingId: makeBookingId(),
      customer: customer._id,
      waterQuantity: Number(waterQuantity),
      deliveryDate,
      timeSlot,
      paymentMethod: paymentMethod || "UPI",
      amount: Number(amount),
      notes: notes || ""
    });

    const populated = await Booking.findById(booking._id)
      .populate("customer")
      .populate("driver");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("customer")
      .populate("driver");

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    if (req.body.driver) {
      await Driver.findByIdAndUpdate(req.body.driver, { status: "On Delivery" });
    }

    if (req.body.status === "Delivered" && booking.driver) {
      await Driver.findByIdAndUpdate(booking.driver._id, { status: "Available" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
