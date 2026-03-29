import { useEffect, useState } from "react";
import {
  getAllAppointments,
  approveAppointment,
  rejectAppointment,
  deleteAppointment,
  getAllUsers,
  updateAppointmentDate,
  toggleUserStatus
} from "../api/api";

import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editId, setEditId] = useState(null);
  const [newDate, setNewDate] = useState("");

  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!admin?.role || admin.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadAppointments(), loadUsers()]);
  };

  const loadAppointments = async () => {
    const res = await getAllAppointments();
    setAppointments(res.data || []);
  };

  const loadUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data || []);
  };

  // ✅ ACTIONS
  const handleApprove = async (id) => {
    const current = appointments.find(a => a._id === id);
    await approveAppointment(id, {
      adminResponse: "Approved",
      date: current?.date
    });
    loadAppointments();
  };

  const handleReject = async (id) => {
    await rejectAppointment(id, { adminResponse: "Rejected" });
    loadAppointments();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      await deleteAppointment(id);
      loadAppointments();
    }
  };

  const handleDateUpdate = async (id) => {
    await updateAppointmentDate(id, { date: newDate });
    setEditId(null);
    setNewDate("");
    loadAppointments();
  };

  const handleToggleUser = async (id) => {
    await toggleUserStatus(id);
    loadUsers();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 📊 STATS
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;

  const totalAppointments = appointments.length;
  const approved = appointments.filter(a => a.status === "approved").length;
  const rejected = appointments.filter(a => a.status === "rejected").length;
  const pending = appointments.filter(a => a.status === "pending").length;

  // 📅 TODAY + TOMORROW
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const format = (d) => d.toISOString().split("T")[0];
  const todayStr = format(today);
  const tomorrowStr = format(tomorrow);

  const upcomingAppointments = appointments.filter((a) => {
    if (!a.date) return false;
    const d = a.date.split("T")[0];
    return d === todayStr || d === tomorrowStr;
  });

  // FILTER
  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard">

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <h2>🩺 Medicare</h2>

        <button onClick={() => { setView("dashboard"); setSidebarOpen(false); }}>
          📊 Dashboard
        </button>

        <button onClick={() => { setView("appointments"); setSidebarOpen(false); }}>
          <LayoutDashboard size={18}/> Appointments
        </button>

        <button onClick={() => { setView("users"); setSidebarOpen(false); }}>
          <Users size={18}/> Users
        </button>

        <button className="logout" onClick={handleLogout}>
          <LogOut size={18}/> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <h2>Admin Dashboard</h2>

          <div className="admin-info">
            <span className="admin-icon">👤</span>
            <span className="admin-name">{admin?.name || "Admin"}</span>
          </div>
        </div>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div className="dashboard-grid">

            <div>
              <div className="cards">
                <div className="card"><h3>Total Users</h3><p>{totalUsers}</p></div>
                <div className="card active"><h3>Active Users</h3><p>{activeUsers}</p></div>
                <div className="card inactive"><h3>Inactive Users</h3><p>{inactiveUsers}</p></div>
                <div className="card"><h3>Total Requests</h3><p>{totalAppointments}</p></div>
                <div className="card approved"><h3>Approved</h3><p>{approved}</p></div>
                <div className="card rejected"><h3>Rejected</h3><p>{rejected}</p></div>
                <div className="card pending"><h3>Pending</h3><p>{pending}</p></div>
              </div>
            </div>

            <div className="right">
              <div className="today-box">
                <h3>📅 Today & Tomorrow</h3>

                {upcomingAppointments.length === 0 ? (
                  <p>No appointments</p>
                ) : (
                  upcomingAppointments.map(a => (
                    <div key={a._id} className="today-item">
                      <span>{a.name} ({a.gender ? a.gender.charAt(0).toUpperCase() + a.gender.slice(1) : "NA"})</span>
                      <span>{a.date?.split("T")[0]}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* APPOINTMENTS */}
        {view === "appointments" && (
          <>
            <div className="filters">
              <button onClick={() => setFilter("all")}>All</button>
              <button onClick={() => setFilter("pending")}>Pending</button>
              <button onClick={() => setFilter("approved")}>Approved</button>
              <button onClick={() => setFilter("rejected")}>Rejected</button>
            </div>

            <div className="list">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Reason</span>
                <span>Gender</span>
                <span>Date</span> 
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filtered.map((a) => (
                <div key={a._id} className="table-row">
                  <span>{a.name}</span>
                  <span>{a.email}</span>
                  <span>{a.reason}</span>
                  <span>{a.gender || "NA"}</span>

                  <div className="date-cell">
                    {editId === a._id ? (
                      <>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                        <button onClick={() => handleDateUpdate(a._id)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span>{a.date?.split("T")[0]}</span>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditId(a._id);
                            setNewDate(a.date?.split("T")[0]);
                          }}
                        >
                          ✏️
                        </button>
                      </>
                    )}
                  </div>

                  <span className={`status ${a.status}`}>{a.status}</span>

                  <div className="actions">
                    <button className="approve" onClick={() => handleApprove(a._id)}>Approve</button>
                    <button className="reject" onClick={() => handleReject(a._id)}>Reject</button>
                    <button className="delete" onClick={() => handleDelete(a._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* USERS */}
        {view === "users" && (
          <div className="list">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {users.map((u) => (
              <div key={u._id} className="table-row">
                <span>{u.name}</span>
                <span>{u.email}</span>
                <span>{u.role}</span>

                <span className={`status ${u.isActive ? "approved" : "rejected"}`}>
                  {u.isActive ? "Active" : "Inactive"}
                </span>

                <button
                  className={`toggle-btn ${u.isActive ? "on" : "off"}`}
                  onClick={() => handleToggleUser(u._id)}
                >
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>  
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;