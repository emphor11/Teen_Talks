// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiUrl } from "../utils/config";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const completeLogin = async (data) => {
    if (!data.user || !data.token) {
      alert("Server returned invalid auth data");
      return;
    }

    login(data.user, data.token, data.posts);

    try {
      const profileRes = await fetch(apiUrl("/profile"), {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profileData = await profileRes.json();

      if (profileRes.ok && profileData.user) {
        navigate(`/profile/${profileData.user.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/signin"), {
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

      await completeLogin(data);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (response) => {
    if (!response?.credential || loading) return;

    try {
      setLoading(true);
      const res = await fetch(apiUrl("/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Google sign-in failed");
        return;
      }

      await completeLogin(data);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-frame flex min-h-screen items-center">
        <div className="hero-grid w-full">
          <section className="fade-up">
            <span className="eyebrow">Teen Talks</span>
            <h1 className="headline mt-5 text-5xl font-extrabold leading-[1.02] text-slate-900 md:text-6xl">
              Log in to your social space.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Jump back into your feed, keep up with friends, and share what
              matters in a cleaner, more modern experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="floating-note">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Daily Flow
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Check your profile, create posts, and move through the feed
                  with a more polished layout.
                </p>
              </div>
              <div className="floating-note">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
                  Fresh UI
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Soft glass cards, warm accents, and stronger visual hierarchy.
                </p>
              </div>
            </div>
          </section>

          <section className="panel auth-card fade-up">
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Welcome Back
              </p>
              <h2 className="headline mt-3 text-3xl font-extrabold text-slate-900">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Use your email and password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input"
                />
              </div>

              <div>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={loading}
            />

            <p className="mt-6 text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold text-orange-500"
              >
                Sign up
              </button>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
