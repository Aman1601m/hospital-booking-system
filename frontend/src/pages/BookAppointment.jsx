import { useState, useEffect } from "react";
import { createAppointment } from "../api/api";
import "../styles/BookAppointment.css";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({});

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(loggedUser);
  }, []);

  const handleBook = async () => {
    if (!user.isActive) {
      setMsg("❌ Your account is inactive. Cannot book appointment.");
      return;
    }

    try {
      await createAppointment({ name, email, phone, reason, date, gender }, token);
      setShowPopup(true);
      setMsg("✅ Appointment Booked Successfully");

      setName(""); setEmail(""); setPhone(""); setReason(""); setDate(""); setGender("");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div className="center">
      <div className="glass">
        <h2>Book Appointment</h2>

        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        
        <select value={gender} onChange={(e)=>setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input type="text" placeholder="Reason" value={reason} onChange={(e)=>setReason(e.target.value)} />
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

        <button onClick={handleBook}>Book</button>
        <button onClick={() => navigate("/dashboard")}>Back To Dashboard</button>

        {showPopup && (
          <div className="popup">
            <div className="popup-box">
              <h3>✅ Appointment Booked!</h3>
              <p>Redirecting to dashboard...</p>
            </div>
          </div>
        )}
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

export default BookAppointment;