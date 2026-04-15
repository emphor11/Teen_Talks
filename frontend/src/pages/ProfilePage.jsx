import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import ProfilePictureUpload from "../components/ProfilePicture";
import { resolveMediaUrl } from "../utils/media";
import { apiUrl } from "../utils/config";



const ProfilePage = () => {
  const { user, logout, posts, setPosts } = useContext(AuthContext);
  // const [searchId, setSearchId] = useState("");
  // const [searchedUser, setSearchedUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const navigate = useNavigate();

  const navPost = () => navigate("/post-test");
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // This now only handles toggling open/closed
  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      setDeletingPostId(postId);
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/posts/${postId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete post");
        return;
      }

      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      if (expandedPost === postId) setExpandedPost(null);
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Something went wrong");
    } finally {
      setDeletingPostId(null);
    }
  };

  if (!user)
    return (
      <div className="social-shell flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600 animate-pulse">Loading profile...</p>
      </div>
    );

  return (
    <div className="social-shell">
      <div className="page-frame">
        <div className="panel topbar">
          <div className="brand-mark">
            <div className="brand-badge">TT</div>
            <div>
              <p className="headline text-lg font-extrabold text-slate-900">
                Profile
              </p>
              <p className="text-sm text-slate-500">
                Manage your identity and review what you’ve posted.
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
            <button onClick={navPost} className="btn-primary">
              Create post
            </button>
            <button onClick={() => navigate("/feed")} className="btn-secondary">
              Open feed
            </button>
            <button onClick={handleLogout} className="btn-ghost">
              Logout
            </button>
          </div>
        </div>

        <div className="profile-header">
          <section className="profile-card fade-up">
            <div className="profile-cover" />
            <div className="profile-content">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">Your Space</span>
                  <h1 className="headline mt-4 text-4xl font-extrabold text-slate-900">
                    {user.name}
                  </h1>
                  <p className="mt-2 text-slate-500">{user.email}</p>
                </div>
                <div className="info-pill">Member ID #{user.id}</div>
              </div>

              <div className="mt-6 max-w-[10rem]">
                <div className="stat-card">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Posts
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900">
                    {posts?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="sidebar-card fade-up">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Profile Picture
            </p>
            <h2 className="headline mt-3 text-3xl font-extrabold text-slate-900">
              Update your look
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Upload flow is unchanged. This panel only makes the interaction
              feel more intentional and social.
            </p>
            <div className="mt-6">
              <ProfilePictureUpload />
            </div>
          </section>
        </div>

        <section className="mt-10 fade-up">
          <div className="section-title">
            <div>
              <span className="eyebrow">Gallery</span>
              <h2 className="headline mt-4 text-4xl font-extrabold text-slate-900">
                Your uploaded posts
              </h2>
            </div>
            <div className="info-pill">{posts?.length || 0} items</div>
          </div>

          {posts?.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-card-body">
                    {post.media_url && (
                      <div className="mb-4">
                        {post.media_url.endsWith(".mp4") ? (
                          <video
                            src={resolveMediaUrl(post.media_url)}
                            controls
                            className="post-media"
                          />
                        ) : (
                          <img
                            src={resolveMediaUrl(post.media_url)}
                            alt="Uploaded media"
                            className="post-media"
                          />
                        )}
                      </div>
                    )}

                    {post.content && (
                      <p className="text-[1.02rem] leading-8 text-slate-700">
                        {post.content}
                      </p>
                    )}

                    <div className="mt-4 interaction-row">
                      <div className="info-pill">Post #{post.id}</div>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="chip-button"
                      >
                        {expandedPost === post.id ? "Hide comments" : "Show comments"}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingPostId === post.id}
                        className="chip-button !border-rose-200 !bg-rose-50 !text-rose-600"
                      >
                        {deletingPostId === post.id ? "Deleting..." : "Delete post"}
                      </button>
                    </div>

                    {expandedPost === post.id && (
                      <div className="mt-5 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <CommentSection postId={post.id} />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="post-card empty-state">
              You haven't uploaded any posts yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
