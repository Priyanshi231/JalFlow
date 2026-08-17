import React from "react";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Truck,
  Wallet,
  Users,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);

  async function load() {
    const [statsResponse, bookingsResponse] = await Promise.all([
      api.get("/reports/dashboard"),
      api.get("/bookings")
    ]);
    setStats(statsResponse.data);
    setBookings(bookingsResponse.data.slice(0, 5));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const cards = [
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? "—",
      icon: CalendarCheck,
      tone: "blue",
      change: "All recorded bookings"
    },
    {
      label: "Active Deliveries",
      value: stats?.activeDeliveries ?? "—",
      icon: Truck,
      tone: "orange",
      change: "Confirmed / on the way"
    },
    {
      label: "Revenue",
      value: formatCurrency(stats?.revenue),
      icon: Wallet,
      tone: "green",
      change: "Paid payments"
    },
    {
      label: "Available Drivers",
      value: stats?.availableDrivers ?? "—",
      icon: Users,
      tone: "purple",
      change: "Ready for assignment"
    }
  ];

  return (
    <div className="page-stack">
      <div className="hero-card">
        <div>
          <span className="eyebrow">TODAY'S OPERATIONS</span>
          <h2>Good afternoon, Priyanshi</h2>
          <p>Keep track of bookings, drivers and payments from one place.</p>
        </div>
        <Link className="primary-button" to="/bookings">
          New Booking <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, tone, change }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
            <div className="stat-content">
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{change}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid two-thirds">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Bookings</h3>
              <p>Latest tanker requests</p>
            </div>
            <Link className="text-link" to="/bookings">View all <ArrowRight size={15} /></Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td><strong>{booking.bookingId}</strong></td>
                    <td>{booking.customer?.name}</td>
                    <td>{booking.waterQuantity.toLocaleString("en-IN")} L</td>
                    <td><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel quick-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common tasks</p>
            </div>
          </div>

          <div className="quick-list">
            <Link to="/bookings" className="quick-item">
              <div className="quick-icon blue"><CalendarCheck size={19} /></div>
              <div><strong>Create booking</strong><span>Add a new tanker request</span></div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/drivers" className="quick-item">
              <div className="quick-icon orange"><Truck size={19} /></div>
              <div><strong>Assign driver</strong><span>Manage delivery assignments</span></div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/payments" className="quick-item">
              <div className="quick-icon green"><Wallet size={19} /></div>
              <div><strong>Record payment</strong><span>Update customer payment</span></div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/reports" className="quick-item">
              <div className="quick-icon purple"><Users size={19} /></div>
              <div><strong>View reports</strong><span>Check business performance</span></div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="info-banner">
        <div>
          <strong>Pending payments</strong>
          <span>{formatCurrency(stats?.pendingAmount)} needs attention.</span>
        </div>
        <Link to="/payments">Review payments <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
