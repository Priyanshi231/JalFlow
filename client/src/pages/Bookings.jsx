import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Filter, Pencil, Truck } from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

const initialForm = {
  customerName: "",
  phone: "",
  address: "",
  waterQuantity: "5000",
  deliveryDate: new Date().toISOString().slice(0, 10),
  timeSlot: "10:00 AM - 12:00 PM",
  paymentMethod: "UPI",
  amount: "1200",
  notes: ""
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(null);

  async function load() {
    const [bookingResponse, driverResponse] = await Promise.all([
      api.get("/bookings"),
      api.get("/drivers")
    ]);
    setBookings(bookingResponse.data);
    setDrivers(driverResponse.data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const term = search.toLowerCase();
      const matchesSearch =
        booking.bookingId.toLowerCase().includes(term) ||
        booking.customer?.name.toLowerCase().includes(term) ||
        booking.customer?.phone.includes(term);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post("/bookings", form);
      setOpen(false);
      setForm(initialForm);
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Could not create booking.");
    } finally {
      setSaving(false);
    }
  }

  async function updateBooking(id, patch) {
    try {
      await api.patch(`/bookings/${id}`, patch);
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update booking.");
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking or customer..."
          />
        </div>

        <div className="toolbar-right">
          <div className="select-wrap">
            <Filter size={16} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>On the Way</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
          <button className="primary-button" onClick={() => setOpen(true)}>
            <Plus size={17} /> New Booking
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Bookings</h3>
            <p>{filtered.length} booking(s) found</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Delivery</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking._id}>
                  <td><strong>{booking.bookingId}</strong></td>
                  <td>
                    <div className="table-primary">{booking.customer?.name}</div>
                    <div className="table-secondary">{booking.customer?.phone}</div>
                  </td>
                  <td>{booking.waterQuantity.toLocaleString("en-IN")} L</td>
                  <td>
                    <div className="table-primary">
                      {new Date(booking.deliveryDate).toLocaleDateString("en-IN")}
                    </div>
                    <div className="table-secondary">{booking.timeSlot}</div>
                  </td>
                  <td>
                    {assigning === booking._id ? (
                      <select
                        className="inline-select"
                        defaultValue={booking.driver?._id || ""}
                        onChange={(e) => {
                          updateBooking(booking._id, { driver: e.target.value || null });
                          setAssigning(null);
                        }}
                      >
                        <option value="">Unassigned</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button className="table-action" onClick={() => setAssigning(booking._id)}>
                        <Truck size={15} />
                        {booking.driver?.name || "Assign"}
                      </button>
                    )}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={booking.status}
                      onChange={(e) => updateBooking(booking._id, { status: e.target.value })}
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>On the Way</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td><strong>₹{booking.amount.toLocaleString("en-IN")}</strong></td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan="7" className="empty-state">No bookings match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title="Create New Booking" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Customer Name
            <input required value={form.customerName} onChange={(e) => change("customerName", e.target.value)} />
          </label>
          <label>
            Phone Number
            <input required value={form.phone} onChange={(e) => change("phone", e.target.value)} />
          </label>
          <label className="full">
            Delivery Address
            <textarea required value={form.address} onChange={(e) => change("address", e.target.value)} />
          </label>
          <label>
            Water Quantity
            <select value={form.waterQuantity} onChange={(e) => change("waterQuantity", e.target.value)}>
              <option value="1000">1,000 L</option>
              <option value="2000">2,000 L</option>
              <option value="3000">3,000 L</option>
              <option value="5000">5,000 L</option>
              <option value="10000">10,000 L</option>
            </select>
          </label>
          <label>
            Amount
            <input type="number" min="0" required value={form.amount} onChange={(e) => change("amount", e.target.value)} />
          </label>
          <label>
            Delivery Date
            <input type="date" required value={form.deliveryDate} onChange={(e) => change("deliveryDate", e.target.value)} />
          </label>
          <label>
            Time Slot
            <select value={form.timeSlot} onChange={(e) => change("timeSlot", e.target.value)}>
              <option>08:00 AM - 10:00 AM</option>
              <option>10:00 AM - 12:00 PM</option>
              <option>12:00 PM - 02:00 PM</option>
              <option>02:00 PM - 04:00 PM</option>
              <option>04:00 PM - 06:00 PM</option>
            </select>
          </label>
          <label>
            Payment Method
            <select value={form.paymentMethod} onChange={(e) => change("paymentMethod", e.target.value)}>
              <option>UPI</option>
              <option>Cash</option>
            </select>
          </label>
          <label className="full">
            Notes
            <textarea value={form.notes} onChange={(e) => change("notes", e.target.value)} placeholder="Optional delivery note" />
          </label>
          <div className="modal-actions full">
            <button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button>
            <button className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Create Booking"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
