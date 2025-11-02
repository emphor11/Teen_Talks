// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Backend response:", res.status, data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (!data.user || !data.token) {
        console.error("Missing user or token in backend response", data);
        alert("Server returned invalid auth data");
        setLoading(false);
        return;
      }

      login(data.user, data.token,data.posts);

      try {
        const profileRes = await fetch("http://localhost:3000/api/v1/profile", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const profileData = await profileRes.json();

        if (profileRes.ok && profileData.user) {
          console.log("Profile fetched successfully:", profileData.user);
          navigate(`/profile/${profileData.user.id}`);
        } else {
          console.error("Error fetching profile:", profileData);
          navigate("/");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-[Poppins]">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 p-3 rounded-xl outline-none transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 p-3 rounded-xl outline-none transition-all duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "opacity-70" : "hover:opacity-90"
            } bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl p-3 transition-all duration-300 shadow-md`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-500 font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
