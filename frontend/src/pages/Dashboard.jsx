import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAppointments } from "../api/api";
import "../styles/Dashboard.css";
import jsPDF from "jspdf";
import { FaPrint, FaDownload } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // 🔄 LOAD DATA
  const loadAppointments = async () => {
    try {
      const res = await getMyAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);

  // 📦 LOAD ON START
  useEffect(() => {
    loadAppointments();
  }, []);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🖨 PRINT
  const handlePrint = (appointment) => {
    const win = window.open("", "", "width=800,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Appointment Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .box { border: 2px solid black; padding: 20px; border-radius: 10px; }
            h2 { text-align: center; }
            .row { margin: 8px 0; }
            .sign { margin-top: 50px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>Appointment Receipt</h2>
            <div class="row"><b>Name:</b> ${appointment.name}</div>
            <div class="row"><b>Email:</b> ${appointment.email}</div>
            <div class="row"><b>Phone:</b> ${appointment.phone || "N/A"}</div>
            <div class="row"><b>Date:</b> ${appointment.suggestedDate || appointment.date}</div>
            <div class="row"><b>Reason:</b> ${appointment.reason}</div>
            <div class="row"><b>Status:</b> ${appointment.status}</div>
            <div class="row"><b>Admin Response:</b> ${appointment.adminResponse || "N/A"}</div>
            <div class="sign">
              <div>___________________<br/>User Signature</div>
              <div>___________________<br/>Authorized Signature</div>
            </div>
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // 📄 PDF DOWNLOAD
  const downloadPDF = (appointment) => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Appointment Receipt", 60, 20);

    pdf.setFontSize(12);
    pdf.text(`Name: ${appointment.name}`, 20, 40);
    pdf.text(`Email: ${appointment.email}`, 20, 50);
    pdf.text(`Phone: ${appointment.phone || "N/A"}`, 20, 60);
    pdf.text(`Date: ${appointment.suggestedDate || appointment.date}`, 20, 80);
    pdf.text(`Reason: ${appointment.reason}`, 20, 90);
    pdf.text(`Status: ${appointment.status}`, 20, 110);
    pdf.text(`Admin Response: ${appointment.adminResponse || "N/A"}`, 20, 120);

    pdf.text("____________________", 20, 160);
    pdf.text("User Signature", 20, 170);
    pdf.text("____________________", 120, 160);
    pdf.text("Authorized Signature", 120, 170);

    pdf.save("appointment.pdf");
  };

  return (
    <div className="user-dashboard">
      {/* NAVBAR */}
      <div className="user-nav">
        <h2>My Dashboard</h2>

        <div className="user-nav-right">
          <button className="user-logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <button
            className="user-contact-btn"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="user-container">
        {/* LEFT */}
        <div className="user-card">
          <h3>Total Appointments</h3>
          <h1>{appointments.length}</h1>

          <button onClick={() => navigate("/book")}>
            + Book Appointment
          </button>
        </div>

        {/* RIGHT */}
        <div className="user-list">
          <h3>My Appointments</h3>

          {appointments.length === 0 ? (
            <p>No appointments yet</p>
          ) : (
            appointments.map((a, i) => (
              <div key={i} className="appointment-card-ui">

                {/* TOP ROW */}
                <div className="card-row">
                  <div>
                    <p className="label">NAME</p>
                    <p className="value">{a.name}</p>
                  </div>

                  <div>
                    <p className="label">EMAIL</p>
                    <p className="value">{a.email}</p>
                  </div>

                  <div className={`status-pill ${a.status}`}>
                    {a.status}
                  </div>
                </div>

                {/* SECOND ROW */}
                <div className="card-row">
                  <div>
                    <p className="label">DATE</p>
                    <p className="value">
                      {a.suggestedDate ? (
                        <>
                          <span className="old-date">{a.date}</span> →{" "}
                          <span className="new-date">{a.suggestedDate}</span>
                        </>
                      ) : (
                        a.date
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="label">REASON</p>
                    <p className="value">{a.reason}</p>
                  </div>
                </div>

                {/* NOTE */}
                <div className="card-note">
                  <p className="label">ADMIN NOTE</p>
                  <p className="value">
                    {a.status === "approved"
                      ? `Approved - ${a.adminResponse &&
                        a.adminResponse.toLowerCase() !== "approved"
                        ? a.adminResponse
                        : "Please arrive 10 minutes early"
                      }`
                      : a.status === "rejected"
                        ? `Rejected - ${a.adminResponse &&
                          a.adminResponse.toLowerCase() !== "rejected"
                          ? a.adminResponse
                          : "Try again later"
                        }`
                        : "Waiting for approval"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="card-actions">
                  <button
                    disabled={a.status !== "approved"}
                    onClick={() => handlePrint(a)}
                    className={`btn print ${a.status !== "approved" && "disabled"}`}
                  >
                    <FaPrint /> Print
                  </button>

                  <button
                    disabled={a.status !== "approved"}
                    onClick={() => downloadPDF(a)}
                    className={`btn download ${a.status !== "approved" && "disabled"}`}
                  >
                    <FaDownload /> Download
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;