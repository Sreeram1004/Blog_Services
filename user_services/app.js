const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "db",
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const JWT_SECRET = process.env.JWT_KEY;

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).send("User registered");
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// Login a user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (
      user.rows.length &&
      (await bcrypt.compare(password, user.rows[0].password))
    ) {
      const token = jwt.sign({ id: user.rows[0].user_id }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

// Retrieve user details
app.get("/users/:id", async (req, res) => {
  try {
    const user = await pool.query("SELECT username FROM users WHERE user_id = $1", [
      req.params.id,
    ]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).send("Error retrieving user details");
  }
});
app.put("/users/:id", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db("users").where("user_id", req.params.id).update({ username, hashedPassword });
    res.send("user updated");
  } catch (err) {
    res.status(500).send("Error updating user");
  }
});

// Delete a blog post
app.delete("/blogs/:id", async (req, res) => {
  try {
    await db("users").where("user_id", req.params.id).del();
    res.send("User deleted");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
