import { useState, useEffect } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user.role) {
      user.role === "admin" ? navigate("/admin") : navigate("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });

      // Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      res.data.user.role === "admin"
        ? navigate("/admin")
        : navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="center">
      <div className="glass">
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>Sign In →</button>

        <p onClick={() => navigate("/register")}>
          New user? <span>Register</span> 
        </p>
      </div>
    </div>
  );
}

export default Login;