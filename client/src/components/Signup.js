import React, { useState } from "react";
import { signup } from "../services/auth.service";

function Signup({ onLogin, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [signupType, setSignupType] = useState("email");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signup(signupType, formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setSignupType("email")}
          style={{
            marginRight: "10px",
            backgroundColor: signupType === "email" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Email
        </button>
        <button
          onClick={() => setSignupType("mobile")}
          style={{
            backgroundColor: signupType === "mobile" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Mobile
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {signupType === "email" ? (
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        ) : (
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account?
        <button
          onClick={onSwitchToLogin}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
