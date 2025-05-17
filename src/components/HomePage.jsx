import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [autoCycle, setAutoCycle] = useState(false);
  const [imageUploadCount, setImageUploadCount] = useState(0);
  const navigate = useNavigate();

  // Function to check if image exists in Firebase storage
  const checkImageExists = async (imageName) => {
    try {
      const imageRef = ref(storage, `images/${imageName}`);
      await getDownloadURL(imageRef);
      return true; // Image exists
    } catch (error) {
      return false; // Image doesn't exist
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCaption("");
      setCurrentCaptionIndex(-1);
      setAutoCycle(false);
      setImageUploadCount(prev => prev + 1); // Increment counter for new image
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    setLoading(true);
    setCaption("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("currentIndex", imageUploadCount.toString()); // Use imageUploadCount instead of currentCaptionIndex

    try {
      console.log("Sending request to generate caption with image count:", imageUploadCount);
      // 1. Send image to Flask backend
      const res = await fetch("http://localhost:5000/generate_caption", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Received response:", data);
      
      if (data.caption) {
        setCaption(data.caption);
        setCurrentCaptionIndex(data.index);
      } else {
        throw new Error("No caption in response");
      }

      // 2. Check if image already exists in Firebase before uploading
      const imageExists = await checkImageExists(image.name);
      if (!imageExists) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        console.log("Image uploaded to Firebase Storage.");
      } else {
        console.log("Image already exists in Firebase Storage, skipping upload.");
      }
    } catch (err) {
      console.error("Error uploading image or fetching caption:", err);
      alert("Failed to generate caption: " + err.message);
    }

    setLoading(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
    setCurrentCaptionIndex(-1);
    setAutoCycle(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtk4C5wdl8S1ogO3KDaC1DecN6byr3ENFPeA&s")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "2.5rem",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "1rem" }}>Image Captioning</h2>

        {!preview ? (
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #66c7c7",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",
              caretColor: "black",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{ borderRadius: "10px", maxWidth: "280px", height: "auto" }}
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <label
                htmlFor="file-input"
                style={{
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "background-color 0.3s",
                }}
              >
                Change Image
              </label>
              <button
                onClick={handleRemoveImage}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  padding: "0.8rem 1.5rem",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                Remove Image
              </button>
            </div>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "#fff",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginBottom: "1rem",
            transition: "background-color 0.3s",
          }}
        >
          Logout
        </button>

        <button
          onClick={handleUpload}
          disabled={!image}
          style={{
            backgroundColor: image ? "#4CAF50" : "#a5d6a7",
            color: "#fff",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            cursor: image ? "pointer" : "not-allowed",
            width: "100%",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Generating..." : "Generate Caption"}
        </button>

        {caption && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ color: "#333", marginBottom: "0.5rem" }}>
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
