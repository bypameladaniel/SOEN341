import { useState } from "react";
import "./LoginSignup.css";
import { User, Mail, KeyRound } from "lucide-react";
import {Link } from "react-router-dom";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "" });
    setError(""); // Clear error message
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    // Make sure all fields are entered.
    if (
      !formData.email ||
      !formData.password ||
      (action === "Sign Up" && !formData.name)
    ) {
      setError("All fields are required.");
      // alert("All fields are required.");
      return;
    }

    console.log(`${action} with:`, formData);
    // call to backend for form handling?
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputs">
          {action === "Login" ? (
            <div></div>
          ) : (
            <div className="input">
              <User class="login-signup-icons" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="input">
            <Mail class="login-signup-icons" />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <KeyRound class="login-signup-icons" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className="forgot-password">
            Lost Password? <span><Link to="/forgotpassword">Click here!</Link></span>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div className="submit-container">
          <button
            type="submit"
            className={action === "Login" ? "submitgray" : "submit"}
            onClick={() => {
              if (action === "Login") 
                handleReset();
                setAction("Sign Up");
            }}
          >
            Sign Up
          </button>
          <button
            type="submit"
            className={action === "Sign Up" ? "submitgray" : "submit"}
            onClick={() => {
              if (action === "Sign Up") 
                handleReset();
                setAction("Login");
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;
