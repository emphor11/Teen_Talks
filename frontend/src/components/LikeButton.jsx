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
      className={`flex items-center gap-1 px-3 py-1 rounded-xl text-white font-semibold transition-all ${
        liked
          ? "bg-pink-500 hover:bg-pink-600"
          : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      ❤️ {likeCount}
    </button>
  );
};

export default LikeButton;
