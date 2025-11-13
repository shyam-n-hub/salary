// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <h2 className="navbar-logo" onClick={() => navigate("/")}>
          PayPredictt
        </h2>

        <button
          className={`menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          </li>

          {!user && (
            <>
              <li>
                <Link to="/login" className={isActive("/login")}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className={isActive("/signup")}>
                  Signup
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link to="/user-input" className={isActive("/user-input")}>
                  User Input
                </Link>
              </li>
              <li>
                <Link to="/user-history" className={isActive("/user-history")}>
                  User History
                </Link>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div
        className={`nav-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      ></div>
    </>
  );
};

export default Navbar;