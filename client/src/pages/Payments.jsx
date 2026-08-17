import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, WalletCards } from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    bookingId: "",
    amount: "",
    method: "UPI",
    status: "Paid",
    reference: ""
  });

  async function load() {
    const [paymentResponse, bookingResponse] = await Promise.all([
      api.get("/payments"),
      api.get("/bookings")
    ]);
    setPayments(paymentResponse.data);
    setBookings(bookingResponse.data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return payments.filter((payment) =>
      payment.customer?.name.toLowerCase().includes(term) ||
      payment.booking?.bookingId.toLowerCase().includes(term)
    );
  }, [payments, search]);

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post("/payments", form);
      setOpen(false);
      setForm({ bookingId: "", amount: "", method: "UPI", status: "Paid", reference: "" });
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Could not record payment.");
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer or booking..." />
        </div>
        <button className="primary-button" onClick={() => setOpen(true)}>
          <Plus size={17} /> Record Payment
        </button>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <div className="mini-icon green"><WalletCards size={18} /></div>
          <div><span>Paid records</span><strong>{payments.filter((p) => p.status === "Paid").length}</strong></div>
        </div>
        <div className="mini-stat">
          <div className="mini-icon orange"><WalletCards size={18} /></div>
          <div><span>Pending records</span><strong>{payments.filter((p) => p.status === "Pending").length}</strong></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div><h3>Payment History</h3><p>Recent payment transactions</p></div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment._id}>
                  <td><strong>{payment.booking?.bookingId}</strong></td>
                  <td>{payment.customer?.name}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td>
                  <td>{payment.method}</td>
                  <td>{payment.reference || "—"}</td>
                  <td><strong>₹{payment.amount.toLocaleString("en-IN")}</strong></td>
                  <td><StatusBadge status={payment.status} /></td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan="7" className="empty-state">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title="Record Payment" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label className="full">
            Booking
            <select
              required
              value={form.bookingId}
              onChange={(e) => {
                const booking = bookings.find((item) => item._id === e.target.value);
                setForm({
                  ...form,
                  bookingId: e.target.value,
                  amount: booking ? String(booking.amount) : ""
                });
              }}
            >
              <option value="">Select booking</option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.bookingId} — {booking.customer?.name} — ₹{booking.amount}
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input type="number" min="0" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </label>
          <label>
            Method
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              <option>UPI</option>
              <option>Cash</option>
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </label>
          <label>
            Reference
            <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Optional UPI reference" />
          </label>
          <div className="modal-actions full">
            <button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button>
            <button className="primary-button">Save Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
