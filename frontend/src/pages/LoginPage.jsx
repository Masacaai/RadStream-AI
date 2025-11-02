import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./healthcare-landing.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- Hardcoded logins ---
    if (email === "ammar@gmail.com" && password === "1234") {
      navigate("/radiologist");
    } else if (email === "aaqel@gmail.com" && password === "1234") {
      navigate("/doctor");
    } else if (email === "abdul@gmail.com" && password === "1234") {
      navigate("/patient");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to access the Hoppr demo.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <span>Create new</span>
        </p>
      </div>
    </div>
  );
}
