import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

export default function LoginPage() {
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Navigate based on role selection
    if (role === "patient") navigate("/patient-demo");
    else if (role === "radiologist") navigate("/radiologist-demo");
    else if (role === "doctor") navigate("/doctor-demo");
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">Sign in to access your Hoppr demo dashboard.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" required />

          <label>Password</label>
          <input type="password" placeholder="••••••••" required />

          <label>Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="login-select"
            required
          >
            <option value="patient">Patient</option>
            <option value="radiologist">Radiologist</option>
            <option value="doctor">Doctor</option>
          </select>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/">Go back</Link>
        </p>
      </div>
    </div>
  );
}
