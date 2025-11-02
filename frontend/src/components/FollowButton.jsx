import React, { useEffect, useState } from "react";

const FollowButton = ({ userId, token }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user follows this person
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/follow/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("data", data);
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Follow status error:", err);
      }
    };
    fetchStatus();
  }, [userId, token]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`http://localhost:3000/api/v1/follow/${userId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Follow response:", data);
      if (res.ok) {
        setIsFollowing(!isFollowing);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-6 py-2.5 rounded-full font-semibold text-white shadow-md transform transition-all duration-300 ${
        isFollowing
          ? "bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 hover:shadow-lg"
          : "bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 hover:shadow-lg"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : isFollowing ? (
        "Unfollow 💔"
      ) : (
        "Follow 💖"
      )}
    </button>
  );
};

export default FollowButton;
