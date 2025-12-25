const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travel"
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

app.get("/api/cities", (req, res) => {
  db.query("SELECT * FROM cities", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/places/:cityId", (req, res) => {
  const { cityId } = req.params;
  db.query("SELECT * FROM places WHERE city_id = ?", [cityId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/bookings", (req, res) => {
  const { eventId, name, phone, email } = req.body;
  db.query(
    "INSERT INTO bookings (event_id, name, phone, email) VALUES (?, ?, ?, ?)",
    [eventId, name, phone, email],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Booking saved successfully" });
    }
  );
});

app.get("/api/suggestions", (req, res) => {
  db.query(
    `SELECT s.id, s.name, s.place_name AS place, s.maps, s.description, s.status, c.name AS city
     FROM suggestions s
     JOIN cities c ON s.city_id = c.id`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/api/suggestions", (req, res) => {
  const { name, cityId, place_name, maps, description } = req.body;
  db.query(
    "INSERT INTO suggestions (name, city_id, place_name, maps, description) VALUES (?, ?, ?, ?, ?)",
    [name, cityId, place_name, maps, description],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Suggestion submitted" });
    }
  );
});

app.delete("/api/suggestions/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM suggestions WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Suggestion deleted" });
  });
});

app.post("/api/register", (req, res) => {
  const { username, email, password_hash } = req.body;
  db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, password_hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    }
  );
});

app.get("/api/users", (req, res) => {
  db.query("SELECT id, username, email, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
