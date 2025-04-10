import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../token";
import { Mail, User, KeyRound } from "lucide-react";
import "./AuthForm.css";
import { AxiosError } from "axios";

interface AuthFormProps {
  method: "Login" | "Sign Up";
  isAuthenticated: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ method, isAuthenticated }) => {
  const [action, setAction] = useState<"Login" | "Sign Up">(
    method === "Login" ? "Login" : "Sign Up"
  );
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!username || !password || (action === "Sign Up" && !email)) {
      setError("All fields are required.");
      // action === "Login" ? navigate("/login") : navigate("/signup");
      setLoading(false);
      return;
    }

    try {
      const route =
            action === "Login"
                ? "http://127.0.0.1:8000/app/token/"
                : "http://127.0.0.1:8000/app/user/register/";
        const payload =
            action === "Login"
                ? { username, password }
                : { username, email, password }; // Include email for registration
        console.log(payload);
        const res = await api.post(route, payload);

      if (action === "Login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        isAuthenticated = true;
        console.log(isAuthenticated);
        navigate("/app/groupsidebar");
        window.location.reload();
      } else {
        setSuccess("Registration successful. Please login.");
        setAction("Login");
      }
    } catch (error: unknown) {
      console.error(error);


      if (error instanceof AxiosError) {
        if (error.response) {
            const { status } = error.response; // Get status properly typed
            if (status === 401) {
                setError("Invalid credentials");
            } else if (status === 400) {
                setError("Username already exists");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } else if (error.request) {
            setError("Network error. Please check your internet connection.");
        } else {
            setError(error.message || "Something went wrong. Please try again.");
        }
    } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Please try again.");
    } else {
        setError("An unknown error occurred.");
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
            <div className="submit-container">
              <button
                type={action === "Sign Up" ? "submit" : "button"}
                className={action === "Login" ? "submitgray" : "submit"}
                onClick={() => {
                  if (action === "Login") {
                    navigate("/signup"); // Navigate if it's gray
                    setAction("Sign Up"); // Otherwise, just set the action
                  }
                }}
              >
                Sign Up
              </button>
              <button
                type={action === "Login" ? "submit" : "button"}
                className={action === "Sign Up" ? "submitgray" : "submit"}
                onClick={() => {
                  if (action === "Sign Up") {
                    navigate("/login"); // Navigate if it's gray
                    setAction("Login"); // Otherwise, just set the action
                  }
                }}
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
