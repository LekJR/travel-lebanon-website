// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cities from "./pages/Cities";
import Events from "./pages/Events";
import More from "./pages/More";
import About from "./pages/About";

import Account from "./pages/Account";

import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";


function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light-theme"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BookingProvider>
        <div className={`app-root ${theme}`}>
          <Navbar theme={theme} setTheme={setTheme} />

        <main className="app-main py-4">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/more" element={<More />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </div>
        </main>


          <Footer />
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
