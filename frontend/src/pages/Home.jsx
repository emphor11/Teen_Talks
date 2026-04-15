// src/pages/Home.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  if (!user?.id) return null;

  return <Navigate to={`/profile/${user.id}`} replace />;
}
