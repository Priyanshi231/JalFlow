import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  CreditCard,
  BarChart3,
  Bell,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/drivers", label: "Drivers", icon: Truck },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: BarChart3 }
];

const titles = {
  "/dashboard": ["Dashboard", "Overview of your water tanker operations"],
  "/bookings": ["Booking Management", "Create, track and manage tanker bookings"],
  "/drivers": ["Driver Management", "Manage drivers and tanker assignments"],
  "/payments": ["Payment Management", "Track paid and pending customer payments"],
  "/reports": ["Reports & Analytics", "Understand bookings, revenue and delivery performance"]
};

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [title, subtitle] = titles[location.pathname] || titles["/dashboard"];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">J</div>
          <div>
            <div className="brand-name">JalFlow</div>
            <div className="brand-subtitle">Tanker Management</div>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="developer-label">Developed by</div>
          <strong>Priyanshi Jain</strong>
          <span>Talking Crooks IT Pvt. Ltd.</span>
        </div>
      </aside>

      {open && <div className="mobile-overlay" onClick={() => setOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" title="Notifications">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="profile-chip">
              <div className="avatar">PJ</div>
              <div className="profile-text">
                <strong>Priyanshi</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>

        <footer className="app-footer">
          <span>JalFlow</span>
          <span>Built during internship at Talking Crooks IT Pvt. Ltd.</span>
        </footer>
      </main>
    </div>
  );
}
