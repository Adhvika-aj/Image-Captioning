// src/components/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaCamera, FaImage, FaUserCircle } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { BsImage, BsType, BsCameraFill } from 'react-icons/bs';
import { MdOutlinePhotoCamera, MdOutlineTextFields } from 'react-icons/md';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      console.error("Signup error details:", {
        code: err.code,
        message: err.message,
        fullError: err
      });
      
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError(`Signup failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      console.error("Google signup error details:", {
        code: err.code,
        message: err.message,
        fullError: err
      });
      setError(`Google signup failed: ${err.message}`);
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

          .signup-card {
            background: rgba(26, 54, 93, 0.85);
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(26, 54, 93, 0.2);
            width: 90%;
            max-width: 450px;
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

          .signup-card::before {
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

          .welcome-icon {
            font-size: 3.5rem;
            margin: 0.5rem 0 1rem 0;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 1;
          }

          .signup-card h2 {
            margin-bottom: 1.5rem;
            color: white;
            font-size: 2rem;
            fontWeight: 700;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
          }

          .input-container {
            position: relative;
            width: 100%;
            margin-bottom: 1rem;
          }

          .input-field {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            box-sizing: border-box;
            height: 3.5rem;
          }
          
          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .input-field:focus {
            border-color: #ff6f61;
            box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.2);
            outline: none;
            background-color: rgba(255, 255, 255, 0.15);
          }

          .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.3s ease;
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
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
          }
          
          .btn-primary {
            background-color: #ff6f61;
            color: white;
            transition: all 0.3s ease;
          }
          
          .btn-primary:hover {
            background-color: #ff5a4a;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 111, 97, 0.2);
          }
          
          .btn-secondary {
            background-color: #66c7c7;
            color: white;
            transition: all 0.3s ease;
          }
          
          .btn-secondary:hover {
            background-color: #55b6b6;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 199, 199, 0.2);
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

          .divider {
            width: 100%;
            margin: 1rem 0;
            position: relative;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.2);
            z-index: 1;
          }

          .divider span {
            position: relative;
            background-color: rgba(26, 54, 93, 0.85);
            padding: 0 1rem;
            font-size: 0.9rem;
            z-index: 2;
          }

          .form-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .login-container {
            width: 100%;
            margin-top: 1.5rem;
            text-align: center;
          }

          .error-message {
            background-color: rgba(198, 40, 40, 0.2);
            color: #ffcdd2;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            border: 1px solid rgba(198, 40, 40, 0.3);
            transition: all 0.3s ease;
            animation: fadeIn 0.3s ease;
          }

          .login-link {
            color: #ff6f61;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
          }

          .login-link:hover {
            color: #ff5a4a;
          }

          .login-link::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #ff5a4a;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }

          .login-link:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
        `}
      </style>

      {/* Decorative floating icons */}
      <FaCamera className="floating-icon" style={{ top: '15%', left: '15%', fontSize: '3rem' }} />
      <BsType className="pulse-icon" style={{ top: '25%', right: '15%', fontSize: '3rem' }} />
      <MdOutlinePhotoCamera className="rotating-icon" style={{ bottom: '20%', left: '20%', fontSize: '4rem' }} />
      <MdOutlineTextFields className="floating-icon" style={{ bottom: '30%', right: '20%', fontSize: '3rem' }} />

      <div className="signup-card">
        <FaUserCircle className="welcome-icon" />
        <h2>Create Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="form-container">
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <ImSpinner8 className="spinner" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="btn btn-secondary"
          disabled={loading}
        >
          <FaGoogle className="btn-icon" />
          {loading ? "Creating Account..." : "Continue with Google"}
        </button>

        <div className="login-container">
          <p style={{ 
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.95rem"
          }}>
            Already have an account?{" "}
            <Link 
              to="/" 
              className="login-link"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
