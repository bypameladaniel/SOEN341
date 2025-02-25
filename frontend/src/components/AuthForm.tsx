import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import "../styles/LoginSignup.css";
import { Mail, User, KeyRound } from "lucide-react";

interface AuthFormProps {
  route: string;
  method: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ route, method }) => {
  const [action, setAction] = useState<"Login" | "Sign Up">(
    method === "login" ? "Login" : "Sign Up"
  );
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password || (action === "Sign Up" && !username)) {
      setError("All fields are required.");
      setLoading(false);
      alert("All fields are required");
      return;
    }

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Registration successful. Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid credentials");
        } else if (error.response.status === 400) {
          setError("Username already exists");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {loading && (
        <div className="loading-indicator">
          {error ? (
            <span className="error-message">{error}</span>
          ) : (
            <div className="spinner"></div>
          )}
        </div>
      )}
      {!loading && (
        <div className="container">
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="inputs">
              {action === "Sign Up" && (
                <div className="input">
                  <Mail className="login-signup-icons" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="input">
                <User className="login-signup-icons" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input">
                <KeyRound className="login-signup-icons" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {action === "Login" && (
              <div className="forgot-password">
                Lost Password? <span><Link to="/forgotpassword">Click here!</Link></span>
              </div>
            )}
            <div className="submit-container">
              <button
                type="submit"
                className={action === "Login" ? "submitgray" : "submit"}
                onClick={() => setAction("Sign Up")}
              >
                Sign Up
              </button>
              <button
                type="submit"
                className={action === "Sign Up" ? "submitgray" : "submit"}
                onClick={() => setAction("Login")}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
