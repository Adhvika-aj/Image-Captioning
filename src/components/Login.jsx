// src/components/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", { email }); // Debug log
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential); // Debug log
      navigate("/home");
    } catch (err) {
      console.error("Login error details:", {
        code: err.code,
        message: err.message,
        fullError: err
      });
      
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address format");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError(`Login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      console.log("Attempting Google login"); // Debug log
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result); // Debug log
      navigate("/home");
    } catch (err) {
      console.error("Google login error details:", {
        code: err.code,
        message: err.message,
        fullError: err
      });
      setError(`Google login failed: ${err.message}`);
    } finally {
      setLoading(false);
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
        <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Login</h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #66c7c7",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",
              caretColor: "black",
              outline: "none",
            }}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1.5rem",
              border: "1px solid #66c7c7",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "black",
              caretColor: "black",
              outline: "none",
            }}
            required
            disabled={loading}
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
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "1rem",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#66c7c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>

        <p style={{ marginTop: "1rem", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#ff6f61", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
