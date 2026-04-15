import React, { useState, useEffect } from "react";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/posts/comments/${postId}`);
      const data = await res.json();
      console.log("Fetched comments:", data);
      setComments(data || []); // ✅ Corrected
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

      const res = await fetch(`http://localhost:3000/api/v1/posts/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      console.log("Added comment:", data);
      if (res.ok) {
        setComments([data, ...comments]); // ✅ Corrected
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
    <div>
      <form className="search-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-input"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Posting..." : "Comment"}
        </button>
      </form>

      <div className="comment-stack">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-card">
              <div className="meta-row">
                <p className="text-sm font-bold text-orange-500">{c.user_name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 leading-7 text-slate-700">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
