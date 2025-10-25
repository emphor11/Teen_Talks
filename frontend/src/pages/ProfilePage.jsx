import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log(data)
        setUser(data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      {<FollowButton userId={userId}/>}
    </div>
  );
};

export default ProfilePage;
