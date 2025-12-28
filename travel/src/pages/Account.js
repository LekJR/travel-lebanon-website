// src/pages/Account.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import "../styles/login.css";
import "../styles/events.css";

function Account() {
  const { user, login, logout } = useAuth();
  const { favorites, bookings, removeBooking } = useBookings();

  // login/register form state
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");      // only for register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) alert("Invalid credentials");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then(async (res) => {
        if (res.status === 409) {
          alert("Email already exists");
          return;
        }
      if (!res.ok) {
          const msg = await res.text();
          alert(msg || "Register failed");
          return;
        }

        alert("Account created! Now login.");
        setMode("login");
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
        alert("Register failed");
      });
  };

  // ====== IF NOT LOGGED IN: SHOW LOGIN/REGISTER UI ======
  if (!user) {
    return (
      <div className="login-page">
        <form
          className="login-form"
          onSubmit={mode === "login" ? handleLogin : handleRegister}
        >
          <h2 className="mb-2">My account</h2>
          <p className="text-muted mb-3">
            {mode === "login"
              ? "Sign in to access your favourites and bookings."
              : "Create a new account to start saving favourites and bookings."}
          </p>

          {/* Toggle buttons */}
          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              className={
                "btn btn-sm " +
                (mode === "login" ? "btn-primary" : "btn-outline-primary")
              }
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={
                "btn btn-sm " +
                (mode === "register" ? "btn-primary" : "btn-outline-primary")
              }
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {/* Name only in register */}
          {mode === "register" && (
            <div className="mb-2">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    );
  }

  // ====== IF LOGGED IN: SHOW ACCOUNT DETAILS ======
  return (
    <div className="account-page">
      <section className="app-section-card mb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="mb-2">My account</h1>
            <p className="mb-1">
              Signed in as:{" "}
              <strong>{user.username || user.Name || user.Email || "User"}</strong>
            </p>
            <p className="text-muted mb-0">
              Your favourites and bookings are saved in the database.
            </p>
          </div>

          <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </section>

      {/* FAVORITES */}
      <section className="app-section-card mb-3">
        <h2 className="mb-1">Favourite events</h2>
        <p className="text-muted mb-0">
          Events you marked with the heart icon on the Events page.
        </p>

        {favorites.length === 0 ? (
          <p className="text-muted mt-3">You haven&apos;t added favourites yet.</p>
        ) : (
          <div className="row g-3 mt-2">
            {favorites.map((event) => (
              <div key={event.id} className="col-12 col-md-6 col-lg-4">
                <article className="event-card">
                  <div className="event-image-wrap">
                    <img src={event.image} alt={event.name} className="event-image" />
                    <span className="event-season-pill">{event.season}</span>
                  </div>

                  <div className="event-body">
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-place">{event.place}</p>
                    <p className="event-description">{event.description}</p>
                    <span className="event-type-pill">{event.type}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOOKINGS */}
      <section className="app-section-card">
        <h2 className="mb-1">Event bookings</h2>
        <p className="text-muted mb-0">Booking requests you sent from the Events page.</p>

        {bookings.length === 0 ? (
          <p className="text-muted mt-3">No bookings yet.</p>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table more-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, index) => (
                  <tr key={b.id || index}>
                    <td>{index + 1}</td>
                    <td>{b.eventName}</td>
                    <td>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.email}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeBooking(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Account;
