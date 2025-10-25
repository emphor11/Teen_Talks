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
          "Content-Type": "application/json",
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
      className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
