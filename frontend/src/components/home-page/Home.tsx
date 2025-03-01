import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Shield, LogIn, UserPlus } from "lucide-react";
import "./Home.css";

const HomePage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onLogin();
    navigate("/app/login");
  };

  const handleSignupClick = () => {
    navigate("/app/signup")
  };

  return (
    <div className="home">
    <div className="home-container">
      <header className="home-header">Welcome to "Application Name TBD"</header>
      <main className="home-main">
        <h1 className="home-title">Connect with Friends, Anytime!</h1>
        <p className="home-description">
          A seamless communication platform designed for communities, gaming, and more.
        </p>
        <div className="home-buttons">
          <button className="login-button" onClick={handleLoginClick}>
            <LogIn size={18} className="button-icon" /> Login
          </button>
          <button className="signup-button" onClick={handleSignupClick}>
            <UserPlus size={18} className="button-icon" /> Sign Up
          </button>
        </div>
        
        <section className="features-section">
          <h2 className="features-title">Why Choose Us?</h2>
          <div className="features-list">
            <div className="feature-item">
              <MessageSquare size={40} />
              <h3>Instant Messaging</h3>
              <p>Fast, reliable, and secure communication for all your needs.</p>
            </div>
            <div className="feature-item">
              <Users size={40} />
              <h3>Community Focused</h3>
              <p>Designed to bring people together with seamless group interactions.</p>
            </div>
            <div className="feature-item">
              <Shield size={40} />
              <h3>Secure & Private</h3>
              <p>Your conversations are encrypted and kept safe from prying eyes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
    </div>
  );
};

export default HomePage;

