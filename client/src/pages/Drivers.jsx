import React from "react";
import { useEffect, useState } from "react";
import { Plus, Phone, Truck, UserRound } from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

const emptyForm = {
  name: "",
  phone: "",
  tankerNumber: "",
  status: "Available"
};

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const response = await api.get("/drivers");
    setDrivers(response.data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post("/drivers", form);
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Could not add driver.");
    }
  }

  async function changeStatus(id, status) {
    try {
      await api.patch(`/drivers/${id}`, { status });
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update driver.");
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <div>
          <h2 className="section-title">Drivers</h2>
          <p className="section-subtitle">Manage your delivery team and tankers.</p>
        </div>
        <button className="primary-button" onClick={() => setOpen(true)}>
          <Plus size={17} /> Add Driver
        </button>
      </div>

      <div className="driver-grid">
        {drivers.map((driver) => (
          <div className="driver-card" key={driver._id}>
            <div className="driver-top">
              <div className="driver-avatar"><UserRound size={21} /></div>
              <StatusBadge status={driver.status} />
            </div>

            <h3>{driver.name}</h3>
            <p>{driver.phone}</p>

            <div className="tanker-row">
              <Truck size={17} />
              <span>{driver.tankerNumber}</span>
            </div>

            <div className="driver-actions">
              <a href={`tel:${driver.phone}`} className="secondary-button">
                <Phone size={15} /> Call
              </a>
              <select
                value={driver.status}
                onChange={(e) => changeStatus(driver._id, e.target.value)}
                className="status-select"
              >
                <option>Available</option>
                <option>On Delivery</option>
                <option>Offline</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title="Add Driver" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Driver Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Phone Number
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Tanker Number
            <input required value={form.tankerNumber} onChange={(e) => setForm({ ...form, tankerNumber: e.target.value })} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Available</option>
              <option>On Delivery</option>
              <option>Offline</option>
            </select>
          </label>
          <div className="modal-actions full">
            <button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button>
            <button className="primary-button">Add Driver</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
