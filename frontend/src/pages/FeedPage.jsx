// src/pages/FeedPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import FollowButton from "../components/FollowButton";
import { resolveMediaUrl } from "../utils/media";
import { AuthContext } from "../context/AuthContext";

const FeedPage = () => {
  const { user, posts: myPosts, setPosts: setMyPosts } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

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
      const res = await fetch(`http://localhost:3000/api/v1/users/${searchName}`, {
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

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      setDeletingPostId(postId);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete post");
        return;
      }

      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));

      if (Array.isArray(myPosts)) {
        const updatedPosts = myPosts.filter((post) => post.id !== postId);
        setMyPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
      }

      if (expandedPost === postId) setExpandedPost(null);
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Something went wrong");
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <div className="social-shell">
      <div className="page-frame">
        <div className="panel topbar">
          <div className="brand-mark">
            <div className="brand-badge">TT</div>
            <div>
              <p className="headline text-lg font-extrabold text-slate-900">
                Social Feed
              </p>
              <p className="text-sm text-slate-500">
                Explore posts and connections in a cleaner stream.
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <Link to="/" className="btn-ghost">
              Home
            </Link>
            <Link to="/chat" className="btn-ghost">
              Chat
            </Link>
            <Link to="/post-test" className="btn-primary">
              New post
            </Link>
          </div>
        </div>

        <div className="layout-grid">
          <aside className="sidebar-stack fade-up">
            <div className="sidebar-card">
              <span className="eyebrow">Discover</span>
              <h2 className="headline mt-4 text-3xl font-extrabold text-slate-900">
                Follow someone new
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Search by username to find a profile and follow them without
                leaving the feed.
              </p>

              <div className="mt-5 search-row">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="text-input"
                />
                <button onClick={handleSearch} className="btn-secondary">
                  Search
                </button>
              </div>
            </div>

            {searchedUser && (
              <div className="sidebar-card fade-up">
                <div className="meta-row">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      {searchedUser.name?.slice(0, 1) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{searchedUser.name}</p>
                      <p className="text-sm text-slate-500">{searchedUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <FollowButton
                    userId={searchedUser.id}
                    token={localStorage.getItem("token")}
                  />
                </div>
                {user?.id !== searchedUser.id && (
                  <button
                    type="button"
                    className="btn-ghost mt-3 w-full"
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          recipient: {
                            id: searchedUser.id,
                            name: searchedUser.name,
                          },
                        },
                      })
                    }
                  >
                    Message
                  </button>
                )}
              </div>
            )}

          </aside>

          <main className="feed-stack">
            <div className="section-title fade-up">
              <div>
                <span className="eyebrow">Live Feed</span>
                <h1 className="headline mt-4 text-4xl font-extrabold text-slate-900">
                  What people are posting
                </h1>
              </div>
              <div className="info-pill">{posts.length} posts</div>
            </div>

            {posts.length === 0 ? (
              <div className="post-card empty-state fade-up">
                Nothing has landed in the feed yet.
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="post-card fade-up">
                  <div className="post-card-body">
                    <div className="post-meta">
                      <div className="flex items-center gap-3">
                        <div className="avatar">{post.author?.slice(0, 1) || "A"}</div>
                        <div>
                          <h3 className="font-bold text-slate-900">{post.author}</h3>
                          <p className="text-sm text-slate-500">
                            Posted by {post.author}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(post.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="info-pill">Post #{post.id}</div>
                    </div>

                    {post.content && (
                      <p className="mt-5 text-[1.02rem] leading-8 text-slate-700">
                        {post.content}
                      </p>
                    )}

                    {post.media_url && (
                      <div className="mt-5">
                        {post.media_url.endsWith(".mp4") ? (
                          <video
                            src={resolveMediaUrl(post.media_url)}
                            controls
                            className="post-media"
                          />
                        ) : (
                          <img
                            src={resolveMediaUrl(post.media_url)}
                            alt="Post media"
                            className="post-media"
                          />
                        )}
                      </div>
                    )}

                    <div className="mt-5 interaction-row">
                      <LikeButton postId={post.id} />
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="chip-button"
                      >
                        {expandedPost === post.id ? "Hide comments" : "Show comments"}
                      </button>
                      {user?.id === post.user_id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingPostId === post.id}
                          className="chip-button !border-rose-200 !bg-rose-50 !text-rose-600"
                        >
                          {deletingPostId === post.id ? "Deleting..." : "Delete post"}
                        </button>
                      )}
                    </div>

                    {expandedPost === post.id && (
                      <div className="mt-5 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <CommentSection postId={post.id} />
                      </div>
                    )}
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

export default FeedPage;
