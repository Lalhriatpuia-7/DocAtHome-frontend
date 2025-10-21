import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { getMyProfile, updateUserProfile } from "../../apis/profileApi";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/profile.css";


const baseURL = import.meta.env.VITE_API_BASE_URL_IMG;

const Profile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch } = useForm();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch profile after AuthContext finishes loading
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const data = await getMyProfile(token);
        if (!data) {
          navigate("/profile/setup");
          return;
        }

        setProfile(data);

        // Pre-fill form fields
        for (const [key, value] of Object.entries(data)) {
          setValue(key, value);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.message?.includes("404")) {
          navigate("/profile/setup");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    // Wait until AuthContext is done checking the token
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, token, setValue, navigate]);

  // ✅ Edit button
  const handleEditBtn = () => {
    setIsEditing(true);
  };

  // ✅ Save handler
  const onSubmit = async (data) => {
    try {

      const formData = new FormData();
      formData.append("age", data.age);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio);
      formData.append("displayPicture", data.displayPicture[0]); // file input
      console.log("formData to be sent:", ...formData.entries());
      const updated = await updateUserProfile(formData, token);
      console.log("Updated profile:", updated);
      setProfile(updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  // ✅ Auth still loading
  if (authLoading) return <p>Loading authentication...</p>;

  // ✅ No user logged in
  if (!user) {
    return (
      <div className="profile-container">
        <p>You need to log in to view your profile.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // ✅ Profile loading or error
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  // ✅ No profile yet
  if (!profile) {
    return (
      <div className="profile-container">
        <p>No profile data available.</p>
        <button onClick={() => navigate("/profile/setup")}>
          Create Profile
        </button>
      </div>
    );
  }

  // ✅ View mode
  if (profile && !isEditing) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <button className="editbtn" onClick={handleEditBtn}>
            <FontAwesomeIcon icon={["fas", "edit"]} />
          </button>
        </div>

        {profile.displayPicture && (
          <img
            src={baseURL + profile.displayPicture}
            alt="Profile"
            style={{
              width: "150px",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}

        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Age:</strong> {profile.age || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {profile.address || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone || "N/A"}
        </p>
        <p>
          <strong>Bio:</strong> {profile.bio || "N/A"}
        </p>
      </div>
    );
  }

  // ✅ Edit mode
  if (profile && isEditing) {
    return (
      <div className="profile-container">
        <h2>Edit Profile</h2>

        {watch("displayPicture") && typeof watch("displayPicture") === "string" && (
          <img
            src={watch("displayPicture")}
            alt="Preview"
            style={{
              width: "150px",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("age")} placeholder="Age" />
          <input
  type="file"
  accept="image/*"
  {...register("displayPicture")}
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }}
/>
          <input {...register("address")} placeholder="Address" />
          <input {...register("phone")} placeholder="Phone" />
          <textarea {...register("bio")} placeholder="Bio" />
          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default Profile;
