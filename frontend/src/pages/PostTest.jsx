// src/pages/PostTest.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PostForm from "../components/PostForm";
// import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";
import { AuthContext } from "../context/AuthContext";

const PostTest = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // add the new post to top
  };

  const handleLogout = () => {
    logout();
    window.location.replace("/login");
  };

  return (
    <div className="social-shell">
      <div className="page-frame">
        <div className="panel topbar">
          <div className="brand-mark">
            <div className="brand-badge">TT</div>
            <div>
              <p className="headline text-lg font-extrabold text-slate-900">
                Post Studio
              </p>
              <p className="text-sm text-slate-500">
                Compose and preview posts with the same existing submission flow.
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <Link to={`/profile/${user?.id ?? ""}`} className="btn-ghost">
              Profile
            </Link>
            <Link to="/feed" className="btn-secondary">
              Feed
            </Link>
            <button onClick={handleLogout} className="btn-ghost">
              Logout
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <main className="feed-stack">
            <PostForm onPostCreated={handlePostCreated} />

            <div className="section-title">
              <div>
                <span className="eyebrow">Preview</span>
                <h2 className="headline mt-4 text-3xl font-extrabold text-slate-900">
                  New posts in this session
                </h2>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="post-card empty-state">
                Your freshly created posts will appear here.
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="post-card fade-up">
                  <div className="post-card-body">
                    {post.content && (
                      <p className="text-[1.02rem] leading-8 text-slate-700">
                        {post.content}
                      </p>
                    )}

                    {post.media_url && post.media_url.endsWith(".mp4") ? (
                      <video className="post-media mt-4" width="100%" controls>
                        <source src={post.media_url} type="video/mp4" />
                      </video>
                    ) : (
                      post.media_url && (
                        <img
                          className="post-media mt-4"
                          src={post.media_url}
                          alt="Post media"
                        />
                      )
                    )}

                    <div className="mt-5 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                      <CommentSection postId={post.id} />
                    </div>
                  </div>
                </article>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PostTest;
