import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import Payment from "../models/Payment.js";

export async function getDashboard(req, res) {
  try {
    const [bookings, drivers, payments] = await Promise.all([
      Booking.find(),
      Driver.find(),
      Payment.find()
    ]);

    const totalBookings = bookings.length;
    const delivered = bookings.filter((b) => b.status === "Delivered").length;
    const activeDeliveries = bookings.filter((b) =>
      ["Confirmed", "On the Way"].includes(b.status)
    ).length;
    const availableDrivers = drivers.filter((d) => d.status === "Available").length;
    const revenue = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = payments
      .filter((p) => p.status === "Pending")
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalBookings,
      delivered,
      activeDeliveries,
      availableDrivers,
      revenue,
      pendingAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getReports(req, res) {
  try {
    const bookings = await Booking.find().populate("customer");
    const payments = await Payment.find().populate("customer");
    const drivers = await Driver.find();

    const monthly = {};
    bookings.forEach((booking) => {
      const key = new Date(booking.deliveryDate).toLocaleString("en-IN", {
        month: "short"
      });
      monthly[key] = (monthly[key] || 0) + 1;
    });

    const revenueByMonth = {};
    payments
      .filter((p) => p.status === "Paid")
      .forEach((payment) => {
        const key = new Date(payment.paymentDate).toLocaleString("en-IN", {
          month: "short"
        });
        revenueByMonth[key] = (revenueByMonth[key] || 0) + payment.amount;
      });

    const customerCounts = {};
    bookings.forEach((booking) => {
      const name = booking.customer?.name || "Unknown";
      customerCounts[name] = (customerCounts[name] || 0) + 1;
    });

    const topCustomers = Object.entries(customerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, bookings]) => ({ name, bookings }));

    res.json({
      bookingTrend: Object.entries(monthly).map(([month, bookings]) => ({
        month,
        bookings
      })),
      revenueTrend: Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue
      })),
      topCustomers,
      driverCount: drivers.length,
      totalWaterSupplied: bookings
        .filter((b) => b.status === "Delivered")
        .reduce((sum, b) => sum + b.waterQuantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
