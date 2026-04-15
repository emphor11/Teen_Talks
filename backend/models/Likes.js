const pool = require("../db")

const toggleLike = async (userId, postId) =>{
    const existing = await pool.query(
        "SELECT * FROM likes WHERE user_id = $1 and post_id = $2",
        [userId,postId]
    )

    if(existing.rows.length > 0){
        await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id =$2",
        [userId,postId]
        )
        return { liked: false };
    }else{
        await pool.query(
            "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
            [userId, postId]
          );
        return { liked: true };
    }

}


const countLikes = async (postId) => {
    const result = await pool.query(
      "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1",
      [postId]
    );
    return result.rows[0].like_count;
  };

const hasUserLiked = async (userId, postId) => {
  const result = await pool.query(
    "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2 LIMIT 1",
    [userId, postId]
  );

  return result.rows.length > 0;
};
  
module.exports = { toggleLike, countLikes, hasUserLiked };
