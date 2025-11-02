// src/pages/PostTest.jsx
import React, { useState } from "react";
import PostForm from "../components/PostForm";
// import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";

const PostTest = () => {
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // add the new post to top
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-[Poppins]">
        Test Post Creation
      </h1>

      <PostForm onPostCreated={handlePostCreated} />

      <div className="w-full max-w-md flex flex-col gap-6 mt-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100 flex flex-col gap-3"
          >
            <p className="text-gray-700 font-[Poppins]">{post.content}</p>

            {post.media_url && post.media_url.endsWith(".mp4") ? (
              <video
                className="rounded-2xl border border-gray-200"
                width="100%"
                controls
              >
                <source src={post.media_url} type="video/mp4" />
              </video>
            ) : (
              post.media_url && (
                <img
                  className="rounded-2xl border border-gray-200"
                  src={post.media_url}
                  alt="post media"
                />
              )
            )}

            <CommentSection postId={post.id} />
            {/* <LikeButton postId={post.id} initialLiked={post.likes} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTest;
