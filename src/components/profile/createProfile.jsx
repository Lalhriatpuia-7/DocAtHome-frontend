import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../apis/profileApi";

const CreateProfile = () => {
  const { register, handleSubmit, watch } = useForm();
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const displayPicture = watch("displayPicture");

  useEffect(() => {
    if (displayPicture && displayPicture.length > 0) {
      const file = displayPicture[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [displayPicture]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("age", data.age);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio);
      formData.append("displayPicture", data.displayPicture[0]); // file input

      const token = localStorage.getItem("token");
      console.log("FormData:", ...formData.entries());

      const response = await createUserProfile(formData, token);

      if (!response) {
        throw new Error("No response from server");
      }

      console.log("Profile created:", response);
      alert("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert(error.message || "An error occurred while creating the profile.");
    }
  };

  return (
    <div>
      <h2>Create Your Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
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
        <input {...register("age")} placeholder="Age" />
        <input {...register("address")} placeholder="Address" />
        <input {...register("phone")} placeholder="Phone" />
        <textarea {...register("bio")} placeholder="Bio" />

        <label htmlFor="displayPicture">Choose a profile image:</label>
<input
  id="displayPicture"
  type="file"
  accept="image/*"
  {...register("displayPicture")}
  style={{ cursor: "pointer", marginBottom: "1rem" }}
/>

        {preview && (
          <div style={{ marginTop: "10px" }}>
            <p>Image Preview:</p>
            <img src={preview} alt="Preview" width="150" />
          </div>
        )}

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateProfile;
