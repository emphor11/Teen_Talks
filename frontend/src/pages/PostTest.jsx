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
    <div>
      <h1>Test Post Creation</h1>
      <PostForm onPostCreated={handlePostCreated} />
      <div>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <p>{post.content}</p>

            {post.media_url.endsWith(".mp4") ? (
      <video width="300" controls >
        <source src={post.media_url} type="video/mp4" />
      </video>
    ) : (
      <img src={post.media_url} alt="post media" width="300" />
    )}
            {console.log(post.media_url)}
          
          <CommentSection postId={post.id}/>
          {/* <LikeButton postId={post.id} initialLiked={post.likes}  /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTest;