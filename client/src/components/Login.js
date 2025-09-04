import React, { useState } from "react";
import { login } from "../services/auth.service";

function Login({ onLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [loginType, setLoginType] = useState("email");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(loginType, formData);

      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}/`;
  };

  return (
    <div>
      <h2>Login</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setLoginType("email")}
          style={{
            marginRight: "10px",
            backgroundColor: loginType === "email" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Email
        </button>
        <button
          onClick={() => setLoginType("mobile")}
          style={{
            backgroundColor: loginType === "mobile" ? "#007bff" : "#ccc",
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
        {loginType === "email" ? (
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
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <p>Or login with:</p>
        <button
          onClick={() => handleOAuthLogin("google")}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: "#db4437",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Google
        </button>
        <button
          onClick={() => handleOAuthLogin("facebook")}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: "#3b5998",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Facebook
        </button>
        <button
          onClick={() => handleOAuthLogin("github")}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          GitHub
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Don't have an account?
        <button
          onClick={onSwitchToSignup}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;
