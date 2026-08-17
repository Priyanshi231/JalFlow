import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./src/config/db.js";
import Customer from "./src/models/Customer.js";
import Driver from "./src/models/Driver.js";
import Booking from "./src/models/Booking.js";
import Payment from "./src/models/Payment.js";

dotenv.config();

async function seed() {
  await connectDB();

  await Promise.all([
    Customer.deleteMany({}),
    Driver.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({})
  ]);

  const customers = await Customer.insertMany([
    {
      name: "Ashok Sharma",
      phone: "9876543210",
      address: "Vijay Nagar, Indore"
    },
    {
      name: "Ankit Patel",
      phone: "9827012345",
      address: "Palasia, Indore"
    },
    {
      name: "Meera Enterprises",
      phone: "9009123456",
      address: "Rau, Indore"
    },
    {
      name: "Sharma Residency",
      phone: "9812345678",
      address: "Bhawarkuan, Indore"
    }
  ]);

  const drivers = await Driver.insertMany([
    {
      name: "Rakesh Verma",
      phone: "9009009001",
      tankerNumber: "MP09-TK-1021",
      status: "On Delivery"
    },
    {
      name: "Rahul Singh",
      phone: "9009009002",
      tankerNumber: "MP09-TK-1044",
      status: "Available"
    },
    {
      name: "Amit Yadav",
      phone: "9009009003",
      tankerNumber: "MP09-TK-1098",
      status: "Available"
    }
  ]);

  const bookings = await Booking.insertMany([
    {
      bookingId: "JF-10001",
      customer: customers[0]._id,
      driver: drivers[0]._id,
      waterQuantity: 5000,
      deliveryDate: new Date(),
      timeSlot: "10:00 AM - 12:00 PM",
      paymentMethod: "UPI",
      status: "On the Way",
      amount: 1200
    },
    {
      bookingId: "JF-10002",
      customer: customers[1]._id,
      driver: drivers[1]._id,
      waterQuantity: 3000,
      deliveryDate: new Date(),
      timeSlot: "12:00 PM - 02:00 PM",
      paymentMethod: "Cash",
      status: "Confirmed",
      amount: 800
    },
    {
      bookingId: "JF-10003",
      customer: customers[2]._id,
      driver: null,
      waterQuantity: 5000,
      deliveryDate: new Date(),
      timeSlot: "02:00 PM - 04:00 PM",
      paymentMethod: "UPI",
      status: "Pending",
      amount: 1200
    },
    {
      bookingId: "JF-10004",
      customer: customers[3]._id,
      driver: drivers[2]._id,
      waterQuantity: 2000,
      deliveryDate: new Date(Date.now() - 86400000),
      timeSlot: "09:00 AM - 11:00 AM",
      paymentMethod: "UPI",
      status: "Delivered",
      amount: 600
    }
  ]);

  await Payment.insertMany([
    {
      booking: bookings[0]._id,
      customer: customers[0]._id,
      amount: 1200,
      method: "UPI",
      status: "Paid",
      reference: "UPI-JF10001"
    },
    {
      booking: bookings[1]._id,
      customer: customers[1]._id,
      amount: 800,
      method: "Cash",
      status: "Pending",
      reference: ""
    },
    {
      booking: bookings[3]._id,
      customer: customers[3]._id,
      amount: 600,
      method: "UPI",
      status: "Paid",
      reference: "UPI-JF10004"
    }
  ]);

  console.log("JalFlow sample data inserted.");
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
