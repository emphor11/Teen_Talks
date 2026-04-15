// src/components/PostForm.jsx
import React, { useState } from "react";
import { apiUrl } from "../utils/config";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !media) return alert("Please add text or media");

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    console.log("form",formData)
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/posts"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("data:", data);
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
    <form onSubmit={handleSubmit} className="composer fade-up">
      <div className="section-title">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Create
          </p>
          <h2 className="headline mt-2 text-3xl font-extrabold text-slate-900">
            Share a new post
          </h2>
        </div>
      </div>

      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-area"
      />

      <div className="mt-4">
        <label className="field-label">Add image or video</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          className="file-input"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="info-pill">
          {media ? `Selected: ${media.name}` : "Attach media if you want"}
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Posting..." : "Post now"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
