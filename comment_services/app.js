const express = require("express");
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

// Add a comment
app.post("/comments", async (req, res) => {
  const { blogId, comment, parentId = null } = req.body;

  try {
    await pool.query(
      "INSERT INTO comments (blog_id, comment, parent_id) VALUES ($1, $2, $3)",
      [blogId, comment, parentId]
    );
    res.status(201).send("Comment added");
  } catch (err) {
    res.status(500).send("Error adding comment");
  }
});

// Get nested comments for a blog post
app.get("/comments", async (req, res) => {
  const { post_id } = req.query;

  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at ASC",
      [post_id]
    );

    // Helper function to build the nested structure
    const buildNestedComments = (comments, parentId = null) =>
      comments
        .filter((comment) => comment.parent_id === parentId)
        .map((comment) => ({
          ...comment,
          replies: buildNestedComments(comments, comment.comment_id),
        }));

    const nestedComments = buildNestedComments(result.rows);
    res.json(nestedComments);
  } catch (err) {
    res.status(500).send("Error fetching comments");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Comment Service running on port ${PORT}`));
