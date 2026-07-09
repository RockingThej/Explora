import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    fetch("/api/bookings", {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    })
      .then((r) => r.json())
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(() => setBookings([]));
  }, []);

  async function cancelBooking(id) {
    if (!window.confirm("Cancel this booking?")) return;

    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setBookings(bookings.filter((b) => b.id !== id));
      alert("Booking cancelled");
    } else {
      alert("Error cancelling booking");
    }
  }

  return (
    <div className="container" style={{ paddingBottom: "40px" }}>
      <h2 className="section-title">Dashboard</h2>
      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        Welcome, <strong>{userName}</strong>
      </p>

      {bookings.length === 0 && (
        <p style={{ fontSize: "18px", opacity: 0.7 }}>No bookings yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {bookings.map((b) => {
          const nights = Math.max(
            1,
            Math.ceil(
              (new Date(b.checkOut) - new Date(b.checkIn)) /
                (1000 * 60 * 60 * 24)
            )
          );

          return (
            <div
              key={b.id}
              style={{
                background: "#0e1b37",
                padding: "20px",
                borderRadius: "12px",
                color: "white",
                border: "1px solid #162447",
              }}
            >
              <h3 style={{ margin: 0, marginBottom: "10px", color: "#14d3ee" }}>
                Booking <span style={{ color: "#fff" }}>{b.ref}</span>
              </h3>

              <div style={{ marginBottom: "8px" }}>
                <strong>Check-in:</strong> {new Date(b.checkIn).toDateString()}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Check-out:</strong>{" "}
                {new Date(b.checkOut).toDateString()}
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong>Rooms:</strong> {b.rooms} &nbsp;&nbsp; | &nbsp;&nbsp;
                <strong>Nights:</strong> {nights}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong>Total:</strong> ₹{b.total}
              </div>

              <button
                style={{
                  background: "#e94560",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => cancelBooking(b.id)}
              >
                Cancel Booking
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
