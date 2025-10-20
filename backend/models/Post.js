const pool = require("../db")


const createPost = async (userId, content, mediaUrl = null) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, content, media_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, content, mediaUrl]
  );
  return result.rows[0];
};

const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT posts.id, posts.content, posts.created_at, users.name AS author
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  )
  return result.rows   // return all posts
}

const getPostById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [id]
  )
  return result.rows[0]
}

module.exports = { createPost, getAllPosts, getPostById }
