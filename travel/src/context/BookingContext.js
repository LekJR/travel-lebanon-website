// src/context/BookingContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// event images (same as your src/data/events.js)
import baalbekfestival from "../assets/Events/baalbekfestival.jpg";
import beirutmarathon from "../assets/Events/beirutmarathon.jpg";
import tyresunset from "../assets/Events/tyresunset.jpg";
import coastalride from "../assets/Events/coastalride.jpg";

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

  // ---------- EVENTS ----------
  useEffect(() => {
    fetch("http://localhost:8080/events")
      .then((res) => res.json())
      .then((data) => {
        // attach local image (so UI keeps using event.image)
        const fixed = data.map((e) => ({
          ...e,
          image: eventImages[e.id] || e.image,
        }));
        setEvents(fixed);
      })
      .catch((err) => console.log(err));
  }, []);

  // ---------- BOOKINGS ----------
  const loadBookings = () => {
    fetch("http://localhost:8080/bookings")
      .then((res) => res.json())
      .then((data) => {
        // your DB columns likely: id, Name, Phone, Email, EventName
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

  // ---------- FAVORITES ----------
  const loadFavorites = () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    fetch("http://localhost:8080/favorites/" + user.id)
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
    // eslint-disable-next-line
  }, [user]);

  // Add booking (used in Events.js)
  // addBooking(name, phone, email, event_name)
  const addBooking = (name, phone, email, event_name) => {
    fetch("http://localhost:8080/addBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, event_name }),
    })
      .then((res) => res.json())
      .then(() => loadBookings())
      .catch((err) => console.log(err));
  };

  // Remove booking by index (keeps your old style)
  const removeBooking = (index) => {
    const booking = bookings[index];
    if (!booking) return;

    fetch("http://localhost:8080/deleteBooking/" + booking.id, {
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
        "http://localhost:8080/deleteFavorite/" + user.id + "/" + event.id,
        { method: "DELETE" }
      )
        .then((res) => res.json())
        .then(() => {
          setFavorites((prev) => prev.filter((fav) => fav.id !== event.id));
        })
        .catch((err) => console.log(err));
    } else {
      fetch("http://localhost:8080/addFavorite", {
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
