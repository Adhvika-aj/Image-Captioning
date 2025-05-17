// src/components/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      alert("Google signup failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtk4C5wdl8S1ogO3KDaC1DecN6byr3ENFPeA&s")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: "3rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "450px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #66c7c7",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",          // text color black
              caretColor: "black",     // cursor color black
              outline: "none",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #66c7c7",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",          // text color black
              caretColor: "black",     // cursor color black
              outline: "none",
            }}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1.5rem",
              border: "1px solid #66c7c7",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",          // text color black
              caretColor: "black",     // cursor color black
              outline: "none",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#ff6f61",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Sign up
          </button>
        </form>

        <button
          onClick={handleGoogleSignup}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#66c7c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          Sign up with Google
        </button>

        <p style={{ marginTop: "1rem", color: "#666" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#ff6f61", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
