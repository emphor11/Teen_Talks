import React, { useContext, useState } from "react";
// import FollowButton from "../components/FollowButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import ProfilePictureUpload from "../components/ProfilePicture";



const ProfilePage = () => {
  const { user, posts } = useContext(AuthContext);
  // const [searchId, setSearchId] = useState("");
  // const [searchedUser, setSearchedUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const navigate = useNavigate();

  const navPost = () => navigate("/post-test");

  // This now only handles toggling open/closed
  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center p-6">
      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 font-[Poppins]">
          Welcome, <span className="text-pink-500">{user.name}</span>
        </h1>
        <p className="text-gray-500 mb-6">{user.email}</p>
        <ProfilePictureUpload />
        
      </div>

      <button
        onClick={navPost}
        className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-all duration-300"
      >
        Create Post
      </button>

      {/* My Uploaded Posts */}
      <div className="mt-10 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          My Uploaded Posts 📸
        </h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
              >
                {post.media_url && (
                  <>
                    {post.media_url.endsWith(".mp4") ? (
                      <video
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        controls
                        className="rounded-xl w-full h-60 object-cover"
                      />
                    ) : (
                      <img
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        alt=""
                        className="rounded-xl w-full h-60 object-cover"
                      />
                    )}
                  </>
                )}
                <p className="text-gray-700 mt-2">{post.content}</p>

                {/* Comments Dropdown */}
                <button
                  onClick={() => toggleComments(post.id)}
                  className="mt-3 text-sm text-pink-600 font-semibold hover:underline"
                >
                  {expandedPost === post.id
                    ? "Hide Comments ▲"
                    : "Show Comments ▼"}
                </button>

                {expandedPost === post.id && (
                  <div className="mt-3">
                    <CommentSection postId={post.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            You haven't uploaded any posts yet.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate("/feed")}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md mt-6"
      >
        Go to Feed
      </button>
    </div>
  );
};

export default ProfilePage;
