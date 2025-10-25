// src/components/CommentSection.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CommentSection = ({ postId }) => {
  const { api } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/post/comments/${postId}`);
      const data = await res.json();
      console.log(data)
      setComments(data.content || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Post a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/v1/post/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      console.log("data",data)
      if (res.ok) {
        setComments([data.content, ...comments]);
        setNewComment("");
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Comment"}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id || `${c.user_id}-${c.created_at}`}  className="comment-item">
                
             {c}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
