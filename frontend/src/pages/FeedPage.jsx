// src/pages/FeedPage.jsx
import React, { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import FollowButton from "../components/FollowButton";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);

  // Fetch all posts for feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/posts/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Feed error:", err);
      }
    };
    fetchFeed();
  }, []);
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/users/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSearchedUser(data.user);
      else alert(data.message || "User not found");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Expand/Collapse comments for post
  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        📰 Feed
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
          >
            {/* Post Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{post.author}</h3>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-3">{post.content}</p>

            {post.media_url && (
              <>
                {post.media_url.endsWith(".mp4") ? (
                  <video
                    src={`http://localhost:3000/api/v1${post.media_url}`}
                    controls
                    className="rounded-xl w-full max-h-80 object-cover"
                  />
                ) : (
                  <img
                    src={`http://localhost:3000/api/v1${post.media_url}`}
                    alt=""
                    className="rounded-xl w-full max-h-80 object-cover"
                  />
                )}
              </>
            )}

            {/* Toggle Comments */}
            <button
              onClick={() => toggleComments(post.id)}
              className="mt-3 text-sm text-pink-600 font-semibold hover:underline"
            >
              {expandedPost === post.id ? "Hide Comments ▲" : "Show Comments ▼"}
            </button>
            <div className="mt-3">
              <LikeButton postId={post.id} />
            </div>

            {/* Comment Section */}
            {expandedPost === post.id && (
              <div className="mt-3 bg-pink-50 rounded-xl p-3">
                <CommentSection postId={post.id} />
              </div>
            )}
            
      </div>
      

            
          
        ))}
        <div>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-gray-200 p-5 rounded-2xl shadow-inner mb-4">
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">
            Search for a user to follow 💫
          </h2>
          <div className="flex gap-2">
            <input
              type="string"
              placeholder="Enter user ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Searched User */}
        {searchedUser && (
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg mt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {searchedUser.name}
            </h3>
            <p className="text-gray-500 mb-3">{searchedUser.email}</p>
            <FollowButton
              userId={searchedUser.id}
              token={localStorage.getItem("token")}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;