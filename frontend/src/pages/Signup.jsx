// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
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
      const res = await fetch("http://localhost:3000/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        alert(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // ✅ Log the user in immediately after signup
      if (data.user && data.token) {
        login(data.user, data.token);

        // ✅ Fetch profile & redirect
        try {
          const profileRes = await fetch("http://localhost:3000/api/v1/profile", {
            headers: { Authorization: `Bearer ${data.token}` },
          });

          const profileData = await profileRes.json();

          if (profileRes.ok && profileData.user) {
            console.log("Profile fetched:", profileData.user);
            navigate(`/profile/${profileData.user.id}`);
          } else {
            console.error("Profile fetch failed:", profileData);
            navigate("/");
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
          navigate("/");
        }
      } else {
        alert("Invalid signup response from server");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-frame flex min-h-screen items-center">
        <div className="hero-grid w-full">
          <section className="panel auth-card fade-up">
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
                Join The Community
              </p>
              <h2 className="headline mt-3 text-3xl font-extrabold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Set up your profile and get into the feed right away.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  className="text-input"
                />
              </div>

              <div>
                <label className="field-label">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="text-input"
                />
              </div>

              <div>
                <label className="field-label">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  type="password"
                  className="text-input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing up..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-sky-600"
              >
                Log in
              </button>
            </p>
          </section>

          <section className="fade-up">
            <span className="eyebrow">Modern Social UI</span>
            <h1 className="headline mt-5 text-5xl font-extrabold leading-[1.02] text-slate-900 md:text-6xl">
              Start sharing in a calmer, brighter interface.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              This refreshed frontend keeps your existing flows, but gives the
              app a more premium social-media feel with stronger spacing,
              hierarchy, and motion.
            </p>
            <div className="mt-8 panel-soft panel-card">
              <div className="stat-grid">
                <div className="stat-card">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Profiles
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Cleaner identity, stronger cover area, improved upload UI.
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
                    Feed
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Editorial-style cards, better media framing, softer glass.
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-500">
                    Actions
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Consistent buttons, inputs, toggles, and mobile layouts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
