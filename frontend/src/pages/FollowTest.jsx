// src/pages/FollowTest.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FollowButton from "../components/FollowButton";

const FollowTest = () => {
  const [users] = useState([
    { id: 9, name: "John Doe", followed: false },
    { id: 13, name: "Emphor", followed: true },
  ]);

  return (
    <div className="social-shell">
      <div className="page-frame">
        <div className="panel topbar">
          <div className="brand-mark">
            <div className="brand-badge">TT</div>
            <div>
              <p className="headline text-lg font-extrabold text-slate-900">
                Follow Preview
              </p>
              <p className="text-sm text-slate-500">
                Shared follow control shown in the updated card style.
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <Link to="/feed" className="btn-secondary">
              Back to feed
            </Link>
          </div>
        </div>

        <div className="post-grid">
          {users.map((user) => (
            <div key={user.id} className="sidebar-card fade-up">
              <div className="flex items-center gap-3">
                <div className="avatar">{user.name.slice(0, 1)}</div>
                <div>
                  <strong className="text-slate-900">{user.name}</strong>
                  <p className="text-sm text-slate-500">User #{user.id}</p>
                </div>
              </div>

              <div className="mt-5">
                <FollowButton
                  userId={user.id}
                  token={localStorage.getItem("token")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowTest;
