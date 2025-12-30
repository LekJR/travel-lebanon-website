// src/context/BookingContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import baalbekfestival from "../assets/Events/baalbekfestival.jpg";
import beirutmarathon from "../assets/Events/beirutmarathon.jpg";
import tyresunset from "../assets/Events/tyresunset.jpg";
import coastalride from "../assets/Events/coastalride.jpg";

console.log("API_BASE =", API_BASE);
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const BookingContext = createContext();

const eventImages = {
  1: beirutmarathon,
  2: coastalride,
  3: tyresunset,
  4: baalbekfestival,
};

export function BookingProvider({ children }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then((res) => res.json())
      .then((data) => {
        const fixed = data.map((e) => ({
          ...e,
          image: eventImages[e.id] || e.image,
        }));
        setEvents(fixed);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadBookings = () => {
    fetch(`${API_BASE}/bookings`)
      .then((res) => res.json())
      .then((data) => {
        const fixed = data.map((b) => ({
          id: b.id,
          eventName: b.EventName || b.eventName || b.event_name,
          name: b.Name || b.name,
          phone: b.Phone || b.phone,
          email: b.Email || b.email,
        }));
        setBookings(fixed);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadFavorites = () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    fetch(`${API_BASE}/favorites/` + user.id)
      .then((res) => res.json())
      .then((data) => {
        const fixed = data.map((e) => ({
          ...e,
          image: eventImages[e.id] || e.image,
        }));
        setFavorites(fixed);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const addBooking = (name, phone, email, event_name) => {
    fetch(`${API_BASE}/addBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, event_name }),
    })
      .then((res) => res.json())
      .then(() => loadBookings())
      .catch((err) => console.log(err));
  };

  const removeBooking = (index) => {
    const booking = bookings[index];
    if (!booking) return;

    fetch(`${API_BASE}/deleteBooking/` + booking.id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setBookings((prev) => prev.filter((_, i) => i !== index));
      })
      .catch((err) => console.log(err));
  };

  const toggleFavorite = (event) => {
    if (!user) return;

    const exists = favorites.some((fav) => fav.id === event.id);

    if (exists) {
      fetch(
        `${API_BASE}/deleteFavorite/` + user.id + "/" + event.id,
        { method: "DELETE" }
      )
        .then((res) => res.json())
        .then(() => {
          setFavorites((prev) => prev.filter((fav) => fav.id !== event.id));
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`${API_BASE}/addFavorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, event_id: event.id }),
      })
        .then((res) => res.json())
        .then(() => {
          setFavorites((prev) => [...prev, event]);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <BookingContext.Provider
      value={{
        events,
        bookings,
        addBooking,
        removeBooking,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}
