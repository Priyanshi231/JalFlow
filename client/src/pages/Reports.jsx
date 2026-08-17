import React from "react";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import api from "../services/api";

export default function Reports() {
  const [data, setData] = useState({
    bookingTrend: [],
    revenueTrend: [],
    topCustomers: [],
    driverCount: 0,
    totalWaterSupplied: 0
  });

  useEffect(() => {
    api.get("/reports/analytics").then((response) => setData(response.data)).catch(console.error);
  }, []);

  return (
    <div className="page-stack">
      <div className="report-highlight">
        <div>
          <span className="eyebrow">BUSINESS INSIGHTS</span>
          <h2>Make better decisions with your data.</h2>
          <p>Use your booking, delivery and payment information to understand daily performance.</p>
        </div>
        <div className="highlight-number">
          <strong>{data.totalWaterSupplied.toLocaleString("en-IN")} L</strong>
          <span>Water delivered</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="panel chart-panel">
          <div className="panel-header"><div><h3>Booking Trend</h3><p>Bookings by month</p></div></div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-header"><div><h3>Revenue Trend</h3><p>Paid revenue by month</p></div></div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="content-grid two-thirds">
        <div className="panel">
          <div className="panel-header"><div><h3>Top Customers</h3><p>Customers with the most bookings</p></div></div>
          <div className="ranking-list">
            {data.topCustomers.map((customer, index) => (
              <div className="ranking-item" key={customer.name}>
                <div className="rank">{index + 1}</div>
                <div><strong>{customer.name}</strong><span>{customer.bookings} booking(s)</span></div>
              </div>
            ))}
            {!data.topCustomers.length && <div className="empty-state">No customer data yet.</div>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><div><h3>Operations</h3><p>Current business indicators</p></div></div>
          <div className="operation-list">
            <div><span>Total drivers</span><strong>{data.driverCount}</strong></div>
            <div><span>Water supplied</span><strong>{data.totalWaterSupplied.toLocaleString("en-IN")} L</strong></div>
            <div><span>Reports</span><strong>Live</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
