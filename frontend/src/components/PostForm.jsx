// src/components/PostForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PostForm = ({ onPostCreated }) => {
  const { user, api, login } = useContext(AuthContext); // use api for requests
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !media) return alert("Please add text or media");

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("data:",data)
      if (res.ok) {
        setContent("");
        setMedia(null);
        onPostCreated(data.post);
        alert("Post created successfully!");
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
