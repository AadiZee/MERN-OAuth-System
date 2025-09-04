import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { getUser } from "./services/auth.service";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await getUser(token);
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("login");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  if (user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      {view === "login" ? (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setView("signup")}
        />
      ) : (
        <Signup
          onLogin={handleLogin}
          onSwitchToLogin={() => setView("login")}
        />
      )}
    </div>
  );
}

export default App;
