import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { resolveMediaUrl } from "../utils/media";
import { apiUrl } from "../utils/config";

const ProfilePictureUpload = () => {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a picture!");
  setLoading(true);

  const formData = new FormData();
  formData.append("profilePic", file);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(apiUrl("/users/profile-pic"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    console.log("Response data:", data);

    if (data.success) {
      // ✅ Update state
      const updatedUser = { ...user, profile_pic: data.profile_pic };
      setUser(updatedUser);

      // ✅ Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("user",user)
      alert("Profile picture updated!");
    } else {
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload Error:", err);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="avatar avatar-lg overflow-hidden !rounded-[1.8rem] !bg-slate-100">
        <img
          src={
            user?.profile_pic
              ? resolveMediaUrl(user.profile_pic)
              : "/default-avatar.png"
          }
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full">
        <label className="field-label">Choose a new image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <button onClick={handleUpload} disabled={loading} className="btn-primary w-full">
        {loading ? "Uploading..." : "Upload profile picture"}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
