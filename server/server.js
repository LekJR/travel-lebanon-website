const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;
const DB = { host: "localhost", user: "root", password: "", database: "tourism_app" };

const pool = mysql.createPool(DB);

// Serve uploads folder
const UPLOADS_DIR = path.join(__dirname, "uploads");
app.use("/uploads", express.static(UPLOADS_DIR));

function baseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

async function ensureColumn(table, column, ddl) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?",
    [table, column]
  );
  if (rows[0].c === 0) await pool.query(ddl);
}

async function prepare() {
  // existing tables
  await ensureColumn("cities", "image_path", "ALTER TABLE cities ADD COLUMN image_path VARCHAR(255) NULL");
  await ensureColumn("places", "image_path", "ALTER TABLE places ADD COLUMN image_path VARCHAR(255) NULL");
  await ensureColumn("events", "image_path", "ALTER TABLE events ADD COLUMN image_path VARCHAR(255) NULL");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      place VARCHAR(150) NOT NULL,
      maps_link TEXT NULL,
      description TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // new tables for Bookings & Favorites
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      event_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      event_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_fav (user_id, event_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

// ---------- AUTH ----------
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const [exists] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length > 0) return res.status(409).json({ error: "Email already exists" });

    await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=? AND password=?", [email, password]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ ok: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- DATA ----------
app.get("/cities", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, short, image_path FROM cities");
    res.json(rows.map(c => ({ ...c, image: `${baseUrl(req)}/cities/${c.id}/image` })));
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/places/:city_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, city_id, slug, title, type, description, maps, image_path FROM places WHERE city_id=?",
      [req.params.city_id]
    );
    res.json(rows.map(p => ({ ...p, image: `${baseUrl(req)}/places/${p.id}/image` })));
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/events", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, season, place, description, type, image_path FROM events"
    );
    res.json(rows.map(ev => ({ ...ev, image: `${baseUrl(req)}/events/${ev.id}/image` })));
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

// ---------- SERVE IMAGES ----------
async function serveImage(table, req, res) {
  const [rows] = await pool.execute(`SELECT image_path FROM \`${table}\` WHERE id=? LIMIT 1`, [req.params.id]);
  if (!rows.length || !rows[0].image_path) return res.sendStatus(404);

  const abs = path.join(__dirname, rows[0].image_path);
  if (!fs.existsSync(abs)) return res.sendStatus(404);

  res.sendFile(abs);
}

app.get("/cities/:id/image", (req, res) => serveImage("cities", req, res));
app.get("/places/:id/image", (req, res) => serveImage("places", req, res));
app.get("/events/:id/image", (req, res) => serveImage("events", req, res));

// ---------- SUGGESTIONS ----------
app.get("/suggestions", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, city, place, maps_link, description FROM suggestions ORDER BY id DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/addSuggestion", async (req, res) => {
  try {
    const { name, city, place, maps_link, description } = req.body || {};
    if (!name || !city || !place)
      return res.status(400).json({ error: "name, city, place required" });

    await pool.execute(
      "INSERT INTO suggestions (name, city, place, maps_link, description) VALUES (?,?,?,?,?)",
      [name, city, place, maps_link || null, description || null]
    );

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.delete("/deleteSuggestion/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM suggestions WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

// ---------- BOOKINGS ----------
app.get("/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bookings ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/addBooking", async (req, res) => {
  const { name, phone, email, event_name } = req.body;
  if (!name || !phone || !event_name)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    await pool.execute(
      "INSERT INTO bookings (Name, Phone, Email, EventName) VALUES (?,?,?,?)",
      [name, phone, email || null, event_name]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.delete("/deleteBooking/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM bookings WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

// ---------- FAVORITES ----------
app.get("/favorites/:user_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.* FROM favorites f
       JOIN events e ON f.event_id = e.id
       WHERE f.user_id = ?`,
      [req.params.user_id]
    );
    res.json(rows.map(ev => ({ ...ev, image: `${baseUrl(req)}/events/${ev.id}/image` })));
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.post("/addFavorite", async (req, res) => {
  const { user_id, event_id } = req.body;
  if (!user_id || !event_id) return res.status(400).json({ error: "Missing user_id or event_id" });

  try {
    await pool.execute("INSERT IGNORE INTO favorites (user_id, event_id) VALUES (?, ?)", [user_id, event_id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.delete("/deleteFavorite/:user_id/:event_id", async (req, res) => {
  const { user_id, event_id } = req.params;
  try {
    await pool.execute("DELETE FROM favorites WHERE user_id=? AND event_id=?", [user_id, event_id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

// ---------- start ----------
prepare()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Startup failed:", e.message || e);
    process.exit(1);
  });
