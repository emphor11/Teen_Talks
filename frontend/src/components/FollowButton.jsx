import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils/config";

const FollowButton = ({ userId, token }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user follows this person
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(apiUrl(`/follow/${userId}`), {
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
      const res = await fetch(apiUrl(`/follow/${userId}`), {
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
      className={`w-full ${
        isFollowing
          ? "btn-ghost !border-rose-200 !bg-rose-50 !text-rose-600"
          : "btn-secondary"
      }`}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;
