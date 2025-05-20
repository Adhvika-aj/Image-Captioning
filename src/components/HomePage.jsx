import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaImage, FaSignOutAlt } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { BsImage, BsType, BsCameraFill } from 'react-icons/bs';
import { MdOutlinePhotoCamera, MdOutlineTextFields } from 'react-icons/md';

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
        background: "linear-gradient(135deg, #1a365d, #2c5282, #2b6cb0)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.5; }
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .floating-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            animation: float 6s ease-in-out infinite;
          }

          .pulse-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            animation: pulse 4s ease-in-out infinite;
          }

          .rotating-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            animation: rotate 20s linear infinite;
          }

          .home-card {
            background: rgba(26, 54, 93, 0.85);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(26, 54, 93, 0.2);
            width: 90%;
            max-width: 500px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-sizing: border-box;
            animation: cardGradient 15s ease infinite;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            overflow: hidden;
          }

          .home-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
            animation: rotate 20s linear infinite;
            pointer-events: none;
          }

          .home-card h2 {
            margin-bottom: 1.5rem;
            color: white;
            font-size: 2rem;
            fontWeight: 700;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
          }

          .btn {
            width: 100%;
            height: 3.5rem;
            padding: 0 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            box-sizing: border-box;
            margin-bottom: 1rem;
            white-space: nowrap;
          }
          
          .btn-primary {
            background-color: #4CAF50;
            color: white;
            transition: all 0.3s ease;
          }
          
          .btn-primary:hover {
            background-color: #45a049;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
          }
          
          .btn-secondary {
            background-color: #2196F3;
            color: white;
            transition: all 0.3s ease;
          }
          
          .btn-secondary:hover {
            background-color: #1e88e5;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
          }

          .btn-danger {
            background-color: #f44336;
            color: white;
            transition: all 0.3s ease;
          }
          
          .btn-danger:hover {
            background-color: #e53935;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
          }
          
          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            transition: all 0.3s ease;
          }

          .btn-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .spinner {
            animation: spin 1s linear infinite;
            width: 1.2rem;
            height: 1.2rem;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .image-preview {
            border-radius: 10px;
            max-width: 280px;
            height: auto;
            margin-bottom: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .caption-text {
            color: white;
            margin-top: 1rem;
            font-size: 1.1rem;
            line-height: 1.5;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .file-input {
            display: none;
          }

          .file-input-label {
            background-color: #2196F3;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .file-input-label:hover {
            background-color: #1e88e5;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
          }
        `}
      </style>

      {/* Decorative floating icons */}
      <FaCamera className="floating-icon" style={{ top: '15%', left: '15%', fontSize: '3rem' }} />
      <BsType className="pulse-icon" style={{ top: '25%', right: '15%', fontSize: '3rem' }} />
      <MdOutlinePhotoCamera className="rotating-icon" style={{ bottom: '20%', left: '20%', fontSize: '4rem' }} />
      <MdOutlineTextFields className="floating-icon" style={{ bottom: '30%', right: '20%', fontSize: '3rem' }} />

      <div className="home-card">
        <h2>Image Captioning</h2>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        {!preview ? (
          <label htmlFor="file-input" className="file-input-label">
            <FaCamera className="btn-icon" />
            Choose Image
          </label>
        ) : (
          <>
            <img
              src={preview}
              alt="preview"
              className="image-preview"
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => document.getElementById('file-input').click()}
                className="btn btn-secondary"
              >
                <FaCamera className="btn-icon" />
                Change Image
              </button>
              <button
                onClick={handleRemoveImage}
                className="btn btn-danger"
              >
                Remove Image
              </button>
            </div>
          </>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          <FaSignOutAlt className="btn-icon" />
          Logout
        </button>

        <button
          onClick={handleUpload}
          disabled={!image}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <ImSpinner8 className="spinner" />
              Generating Caption...
            </>
          ) : (
            <>
              <FaImage className="btn-icon" />
              Generate Caption
            </>
          )}
        </button>

        {caption && (
          <div className="caption-text">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
