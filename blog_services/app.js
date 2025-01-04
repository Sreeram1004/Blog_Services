const express = require("express");
const knex = require("knex");
const { attachPaginate } = require("knex-paginate");

attachPaginate();

const app = express();
app.use(express.json());

const db = knex({
  client: "pg",
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "db",
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  },
});

// Create a new blog post
app.post("/blogs", async (req, res) => {
  const { userId, title, content } = req.body;

  try {
    await db("blogs").insert({ user_id: userId, title, content });
    res.status(201).send("Blog post created");
  } catch (err) {
    res.status(500).send("Error creating blog post");
  }
});

// List all blog posts with pagination
app.get("/blogs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const blogs = await db("blogs")
      .select("blog_id", "title", "content", "created_at")
      .orderBy("created_at", "desc")
      .paginate({ perPage: parseInt(limit), currentPage: parseInt(page) });

    res.json(blogs);
  } catch (err) {
    res.status(500).send("Error fetching blogs");
  }
});

// Fetch a specific blog post
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await db("blogs").where("blog_id", req.params.id).first();
    res.json(blog);
  } catch (err) {
    res.status(500).send("Error fetching blog post");
  }
});

// Edit a blog post
app.put("/blogs/:id", async (req, res) => {
  const { title, content } = req.body;

  try {
    await db("blogs").where("blog_id", req.params.id).update({ title, content });
    res.send("Blog post updated");
  } catch (err) {
    res.status(500).send("Error updating blog post");
  }
});

// Delete a blog post
app.delete("/blogs/:id", async (req, res) => {
  try {
    await db("blogs").where("blog_id", req.params.id).del();
    res.send("Blog post deleted");
  } catch (err) {
    res.status(500).send("Error deleting blog post");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Blog Service running on port ${PORT}`));
