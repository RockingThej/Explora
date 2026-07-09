import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  return (
    <header className="header">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT NAVIGATION */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="logo">Explora</div>

          <nav className="nav" style={{ display: "flex", gap: "12px" }}>
            <Link to="/">Home</Link>
            <Link to="/accommodations">Accommodations</Link>
            <Link to="/book">Booking</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Feedback</Link>
          </nav>
        </div>

        {/* RIGHT NAVIGATION */}
        <div style={{ display: "flex", gap: "12px" }}>
          {!isLoggedIn && (
            <>
              {/* Login ONLY */}
              <Link to="/login">Login</Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/dashboard">Dashboard</Link>

              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
