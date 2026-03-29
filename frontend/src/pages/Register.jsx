import { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Register user
      const res = await registerUser({ name, email, password });

      // Turant login jaise localStorage me save kar dena
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ ...res.data.user, isActive: true }));

      alert("Registered & Logged In Successfully");

      navigate("/dashboard"); // Direct dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="center">
      <div className="glass">
        <h2>Register</h2>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleRegister}>Register</button>

        <p onClick={() => navigate("/")}>
          Already have account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;