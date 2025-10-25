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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl mb-4">Create an Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          className="border p-2"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="border p-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
