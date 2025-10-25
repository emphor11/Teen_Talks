import React, { useState, useEffect } from "react";

const LikeButton = ({ postId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/post/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount((prev) => prev + (data.liked ? 1 : -1));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        background: liked ? "red" : "gray",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
      }}
    >
      ❤️ {likeCount}
    </button>
  );
};

export default LikeButton;
