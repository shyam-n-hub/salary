import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  // Calculate password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 1) setPasswordStrength("weak");
    else if (strength <= 2) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [password]);

  // Check if passwords match
  useEffect(() => {
    if (rePassword.length === 0) {
      setPasswordsMatch(null);
      return;
    }
    setPasswordsMatch(password === rePassword);
  }, [password, rePassword]);

  // =============== EMAIL SIGNUP ===============
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (password !== rePassword) {
      setErrorMsg("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in Realtime DB
      await set(ref(db, "users/" + user.uid + "/profile"), {
        name: name,
        email: email,
        signupMethod: "Email",
        createdAt: new Date().toISOString()
      });

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("Email already in use. Please login instead.");
      } else if (error.code === "auth/weak-password") {
        setErrorMsg("Password is too weak. Please use a stronger password.");
      } else {
        setErrorMsg("Signup failed. Please try again.");
      }
      setIsLoading(false);
      console.error(error);
    }
  };

  // =============== GOOGLE SIGNUP ===============
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info in Realtime DB
      await set(ref(db, "users/" + user.uid + "/profile"), {
        name: user.displayName,
        email: user.email,
        signupMethod: "Google",
        createdAt: new Date().toISOString()
      });

      navigate("/");
    } catch (error) {
      setErrorMsg("Google signup failed. Please try again.");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSignup}>
        <h2>Create Account </h2>
        <p className="signup-subtitle">Join PayPredictt and start predicting salaries</p>

        {errorMsg && (
          <div className="error-message">
            <span>⚠️</span>
            {errorMsg}
          </div>
        )}

        <div className="signup-input-group">
          <input
            type="text"
            placeholder="Full Name"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          {name.length > 0 && (
            <span className="input-validation-icon valid">✓</span>
          )}
        </div>

        <div className="signup-input-group">
          <input
            type="email"
            placeholder="Email Address"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          {email.includes("@") && email.includes(".") && (
            <span className="input-validation-icon valid">✓</span>
          )}
        </div>

        <div className="signup-input-group">
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {passwordStrength && (
            <div className="password-strength">
              <div className={`password-strength-bar password-strength-${passwordStrength}`}></div>
            </div>
          )}
        </div>

        <div className="signup-input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {passwordsMatch !== null && (
            <div className={`password-match ${passwordsMatch ? 'match' : 'no-match'}`}>
              <span className="password-match-icon">
                {passwordsMatch ? '✓' : '✗'}
              </span>
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}
        </div>

        <button 
          className="signup-button" 
          type="submit"
          disabled={isLoading || !passwordsMatch}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="signup-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="google-signup-button"
          disabled={isLoading}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
          />
          Sign up with Google
        </button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}