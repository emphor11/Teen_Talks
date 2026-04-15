import React, { useState, useEffect } from "react";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/v1/posts/${postId}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("data",data)
        if (data.success) {
          setLiked(data.liked);
      setLikeCount(data.count);
        }
      } catch (err) {
        console.error("Error fetching like info:", err);
      }
    };

    fetchLikeInfo();
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.count);
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
      className={`chip-button ${
        liked
          ? "!border-orange-200 !bg-orange-50 !text-orange-600"
          : "!bg-white/80 !text-slate-700"
      }`}
    >
      <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span>
      {likeCount}
    </button>
  );
};

export default LikeButton;
