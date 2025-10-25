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
      // call API via AuthContext.api or directly using API import
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

      login(data.user, data.token);

try {
  // Fetch logged-in user profile using token
  const profileRes = await fetch("http://localhost:3000/api/v1/profile", {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  const profileData = await profileRes.json();

  if (profileRes.ok && profileData.user) {
    console.log("Profile fetched successfully:", profileData.user);
    navigate(`/profile/${profileData.user.id}`); // ✅ redirect to own profile page
  } else {
    console.error("Error fetching profile:", profileData);
    navigate("/"); // fallback
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded p-2"
      >
        Login
      </button>
    </form>
  );
};
